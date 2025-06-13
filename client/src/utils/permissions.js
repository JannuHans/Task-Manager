// Role definitions
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Permission definitions
export const PERMISSIONS = {
  // User permissions
  VIEW_OWN_PROFILE: 'view_own_profile',
  VIEW_OWN_TASKS: 'view_own_tasks',
  CREATE_OWN_TASKS: 'create_own_tasks',
  EDIT_OWN_TASKS: 'edit_own_tasks',
  DELETE_OWN_TASKS: 'delete_own_tasks',
  UPLOAD_DOCUMENTS: 'upload_documents',
  FILTER_OWN_TASKS: 'filter_own_tasks',

  // Admin permissions
  VIEW_ALL_USERS: 'view_all_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  VIEW_ALL_TASKS: 'view_all_tasks',
  CREATE_ALL_TASKS: 'create_all_tasks',
  EDIT_ALL_TASKS: 'edit_all_tasks',
  DELETE_ALL_TASKS: 'delete_all_tasks',
  ASSIGN_TASKS: 'assign_tasks',
  BULK_OPERATIONS: 'bulk_operations',
  ACCESS_ADMIN_DASHBOARD: 'access_admin_dashboard',
};

// Role to permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.USER]: [
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.VIEW_OWN_TASKS,
    PERMISSIONS.CREATE_OWN_TASKS,
    PERMISSIONS.EDIT_OWN_TASKS,
    PERMISSIONS.DELETE_OWN_TASKS,
    PERMISSIONS.UPLOAD_DOCUMENTS,
    PERMISSIONS.FILTER_OWN_TASKS,
  ],
  [ROLES.ADMIN]: [
    // All user permissions
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.VIEW_OWN_TASKS,
    PERMISSIONS.CREATE_OWN_TASKS,
    PERMISSIONS.EDIT_OWN_TASKS,
    PERMISSIONS.DELETE_OWN_TASKS,
    PERMISSIONS.UPLOAD_DOCUMENTS,
    PERMISSIONS.FILTER_OWN_TASKS,
    // Admin specific permissions
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.VIEW_ALL_TASKS,
    PERMISSIONS.CREATE_ALL_TASKS,
    PERMISSIONS.EDIT_ALL_TASKS,
    PERMISSIONS.DELETE_ALL_TASKS,
    PERMISSIONS.ASSIGN_TASKS,
    PERMISSIONS.BULK_OPERATIONS,
    PERMISSIONS.ACCESS_ADMIN_DASHBOARD,
  ],
};

// Helper functions
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const isAdmin = (userRole) => userRole === ROLES.ADMIN;

export const canManageUser = (currentUserRole, targetUserId, currentUserId) => {
  if (isAdmin(currentUserRole)) return true;
  return currentUserId === targetUserId;
};

export const canManageTask = (currentUserRole, taskUserId, currentUserId) => {
  if (isAdmin(currentUserRole)) return true;
  return currentUserId === taskUserId;
};

export const canAssignTask = (currentUserRole) => {
  return isAdmin(currentUserRole);
};

export const canUploadDocument = (currentUserRole, taskUserId, currentUserId, currentDocumentCount) => {
  if (currentDocumentCount >= 3) return false;
  return canManageTask(currentUserRole, taskUserId, currentUserId);
};

export const canAccessAdminDashboard = (currentUserRole) => {
  return isAdmin(currentUserRole);
}; 