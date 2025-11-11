import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsNumber, isNumber, IsOptional, IsString, Length } from 'class-validator'

export class CreateDeptDto {
    @IsString()
    @IsNotEmpty()
    @Length(0, 20, {
        message: `部门名称长度必须在$constraint1和$constraint2之间,当前传递的值是: $value`,
    })
    deptName: string

    @IsString()
    @Length(0, 10, {
        message: `部门编码长度必须在$constraint1和$constraint2之间,当前传递的值是: $value`,
    })
    deptCode?: string

    @IsNumber()
    @IsOptional()
    parentId?: number

    @IsNumber()
    @IsNotEmpty()
    status?: number

    @IsNumber()
    @IsNotEmpty()
    orderNumber?: number
}

export class UpdateDeptDto extends PartialType(CreateDeptDto) {
    @IsString()
    @IsNotEmpty()
    deptName: string

    @IsString()
    @IsNotEmpty()
    deptCode: string

    @IsNumber()
    @IsNotEmpty()
    status: number

    @IsNumber()
    @IsOptional()
    orderNumber?: number
}

export class GetDeptDto extends PartialType(CreateDeptDto) {
    @IsOptional()
    deptName?: string
}
