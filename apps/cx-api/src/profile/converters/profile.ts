import { ProfileEntity } from 'apps/cx-api/entities/profile.entity';
import { ProfileResponseEntity } from '../entities/profile.response';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export class ProfileConverter {
  static toUpdateInput(output: ProfileEntity, input: UpdateProfileDto) {
    output.company_name = input.companyName;
    output.contact_number = input.contactNumber;
    output.fax_number = input.faxNumber;
    output.license_number = input.licenseNumber;
    output.tax_number = input.taxNumber;

    return output;
  }

  static fromTable(res: ProfileEntity) {
    const output = new ProfileResponseEntity();

    output.id = res.id;
    output.companyName = res.company_name;
    output.contactNumber = res.contact_number;
    output.faxNumber = res.fax_number;
    output.licenseNumber = res.license_number;
    output.taxNumber = res.tax_number;
    output.dotNumber = res.dot_number;
    output.saferVerified = res.safer_verified;

    output.createdAt = res.created_at.toISOString();
    output.updatedAt = res.updated_at.toISOString();
    output.deletedAt = res.deleted_at?.toISOString();

    return output;
  }
}
