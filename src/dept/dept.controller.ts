import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common'
import { DeptService } from './dept.service'
import { CreateDeptDto, GetDeptDto, UpdateDeptDto } from './dto/index.dto'

@Controller('dept')
export class DeptController {
    constructor(private readonly deptService: DeptService) {}

    @Post()
    create(@Body() createDeptDto: CreateDeptDto, @Request() req: any) {
        return this.deptService.create({ ...createDeptDto, createBy: req.user.username })
    }

    @Get()
    findAll(@Query() getDeptDto: GetDeptDto) {
        return this.deptService.findAll(getDeptDto)
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.deptService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateDeptDto: UpdateDeptDto) {
        return this.deptService.update(id, updateDeptDto)
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.deptService.softRemoveWithChildren(id)
    }
}
