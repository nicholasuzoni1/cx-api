import axios from 'axios';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { LangKeys } from '@app/lang-lib/lang-keys';
import { NotFoundErrorHttp } from '@app/shared-lib/http-errors';
import { ProfileEntity } from 'apps/cx-api/entities/profile.entity';
import { SaferVerifDto } from './dto/safer-verification.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileConverter } from './converters/profile';
import { ProfileResponseEntity } from './entities/profile.response';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileService: Repository<ProfileEntity>,
  ) {}

  async update(
    data: UpdateProfileDto,
    userId: number,
  ): Promise<ProfileResponseEntity> {
    const userProfile = await this.profileService.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!userProfile) {
      throw new NotFoundErrorHttp(LangKeys.ProfileNotFoundErrorKey);
    }

    await this.profileService.update(
      { id: userProfile.id },
      ProfileConverter.toUpdateInput(userProfile, data),
    );

    const updatedProfile = await this.profileService.findOne({
      where: { id: userProfile.id },
    });

    return ProfileConverter.fromTable(updatedProfile);
  }

  async get(userId: number): Promise<ProfileResponseEntity> {
    const profile = await this.profileService.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return ProfileConverter.fromTable(profile);
  }

  async saferVerification(
    input: SaferVerifDto,
    userId: number,
  ): Promise<ProfileResponseEntity> {
    const result = await axios.get(
      `https://mobile.fmcsa.dot.gov/qc/services/carriers/${input.dotNumber}?webKey=${process.env.FMCSA_WEB_KEY}`,
    );

    if (result?.data?.statusCode === 'A') {
      const profile = await this.get(userId);

      if (profile) {
        await this.profileService.update(
          { id: profile?.id },
          { dot_number: input.dotNumber, safer_verified: true },
        );
      }
    }

    return await this.get(userId);
  }
}
