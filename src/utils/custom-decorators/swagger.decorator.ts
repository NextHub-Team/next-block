import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

/**
 * Custom decorator for tagging APIs with roles, descriptions, and permissions.
 * @param role - Role name (e.g., 'Admin', 'Client')
 * @param description - Multi-line description of the API
 * @param permissions - JSON object describing permissions for the API
 */
export function Description(
  role: 'Admin' | 'Client',
  description: string,
  permissions: Record<string, any>,
) {
  // Generate permissions list in Markdown
  const permissionList = Object.keys(permissions)
    .map((key) => `- ${key}`)
    .join('\n');

  // Styled Markdown description
  const markdownDescription = `
**Role:** ${role === 'Admin' ? '**Admin**' : '**Client**'}  

**Description:**  
${description.replace(/\n/g, '\n')}  

**Permissions:**  
${permissionList}
  `;

  return applyDecorators(
    ApiTags(role), // Add Swagger tag for grouping
    ApiOperation({
      description: markdownDescription,
      summary: `${role.toUpperCase()}`, // Brief summary
    }),
  );
}
