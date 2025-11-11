import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request } from '@nestjs/common'
import { MenusService } from './menus.service'
import { CreateMenuDto, GetMenuDto, UpdateMenuDto } from './dto'

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) {}

    @Post()
    create(@Body() createMenuDto: CreateMenuDto, @Request() req: any) {
        return this.menusService.create({ ...createMenuDto, createBy: req.user.username })
    }

    @Get()
    findAll(@Query() getMenuDto: GetMenuDto) {
        return this.menusService.findAll(getMenuDto)
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.menusService.findOne(id)
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
        return this.menusService.update(id, updateMenuDto)
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.menusService.softRemoveWithChildren(id)
    }
}
