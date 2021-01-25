import { TApprovalStatus } from "./approval.entity";

export class ApprovalDTO {
    status: TApprovalStatus;
    effectiveDate?: Date;
}