export type PaginationResult<T> = {
  items: T[];
  total: number;
};

export type BaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuditFields = {
  createdBy?: string | null;
  updatedBy?: string | null;
};

export type ApiErrorResponse = {
  message: string;
  code: string;
  status: number;
};
