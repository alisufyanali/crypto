import { NavItem } from '@/types';

/**
 * Filter navigation items based on user role
 */
export function filterNavByRole(items: NavItem[], userRole: string | string[]): NavItem[] {
    const roles = Array.isArray(userRole) ? userRole : [userRole];
    
    return items.filter((item) => {
        // If no roles specified, show to everyone
        if (!item.roles || item.roles.length === 0) {
            return true;
        }
        
        // Check if user has any of the required roles
        return item.roles.some(role => 
            roles.some(userRoleItem => 
                userRoleItem.toLowerCase() === role.toLowerCase()
            )
        );
    }).map(item => {
        // If item has children, filter them recursively
        if (item.items && item.items.length > 0) {
            return {
                ...item,
                items: filterNavByRole(item.items, userRole)
            };
        }
        return item;
    });
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string | string[], requiredRoles: string[]): boolean {
    const roles = Array.isArray(userRole) ? userRole : [userRole];
    
    return requiredRoles.some(required => 
        roles.some(role => role.toLowerCase() === required.toLowerCase())
    );
}