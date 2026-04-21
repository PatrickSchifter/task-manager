import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth/jwt-auth.guard'
import { McpService } from './mcp.service'

interface McpRequestDto {
  prompt: string
  context?: {
    userId?: string
    projectId?: string
    taskId?: string
    conversationId?: string
    [key: string]: any
  }
}

interface ActionResponseDto {
  type: string
  payload?: any
  confidence?: number
}

interface McpResponseDto {
  response: string
  actions: ActionResponseDto[]
}

@Controller('mcp')
@UseGuards(JwtAuthGuard)
export class McpController {
  constructor(private mcpService: McpService) {}

  @Post('process')
  async processRequest(@Body() dto: McpRequestDto, @Request() req): Promise<McpResponseDto> {
    // Add user ID from JWT token to context
    // JWT strategy returns the user object, so req.user contains the full user
    const context = {
      ...dto.context,
      userId: req.user?.id, // Extract user ID from JWT payload
    }

    const result = await this.mcpService.processRequest(dto.prompt, context)
    return {
      response: result.response,
      actions: result.actions || [],
    }
  }

  @Get('capabilities')
  getCapabilities() {
    return this.mcpService.getCapabilities()
  }

  @Post('execute-action')
  async executeAction(@Body() dto: { actionType: string; payload: any }, @Request() req) {
    // This endpoint would handle executing actions suggested by the AI
    // For now, we'll return a placeholder - you'd implement specific action handlers
    // In a real implementation, you would dispatch to appropriate service methods
    // based on the actionType and payload
    return {
      success: true,
      message: `Action ${dto.actionType} executed`,
      data: dto.payload,
    }
  }
}
