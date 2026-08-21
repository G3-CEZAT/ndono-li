import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existing) {
      throw new ConflictException('Ce numéro de téléphone est déjà associé à un compte');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        fullName: dto.fullName || null,
        password: hashedPassword,
        role: (dto.role as Role) || Role.PELERIN,
      },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        subscriptionExpiresAt: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.phone, user.role);

    return {
      message: 'Compte créé avec succès',
      accessToken: token,
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides (numéro ou mot de passe incorrect)');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Identifiants invalides (numéro ou mot de passe incorrect)');
    }

    const token = this.generateToken(user.id, user.phone, user.role);

    return {
      message: 'Connexion réussie',
      accessToken: token,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        fullName: true,
        role: true,
        subscriptionExpiresAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const isSubscribed = user.subscriptionExpiresAt 
      ? new Date(user.subscriptionExpiresAt) > new Date()
      : false;

    return {
      ...user,
      isSubscribed,
    };
  }

  private generateToken(userId: string, phone: string, role: string): string {
    const payload = { sub: userId, phone, role };
    return this.jwtService.sign(payload);
  }
}
