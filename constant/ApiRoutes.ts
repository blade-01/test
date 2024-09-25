export default {
  auth: {
    signIn: "/portaluser/portaluser/login",
    signUp: "/portaluser/portaluser/sign-up",
    verifyEmail: "/portaluser/portaluser/verify-email",
    resendVerificationEmail: "/portaluser/portaluser/resend-verification-email",
    requestPasswordReset: "/portaluser/portaluser/request-password-reset",
    validatePasswordResetCode: "/portaluser/portaluser/valid-password-reset",
    resetPassword: "/portaluser/portaluser/reset-password",
    signOut: "/portaluser/portaluser/logout"
  },
  deal: {
    get: "/portaluser/portaluser-deal/read"
  },
  user: {
    me: "/portaluser/portaluser/me",
    update: "/portaluser/portaluser/user-update",
    getAll: "/portaluser/portaluser/",
    createAppointment: "/portaluser/portaluser-appointment/create",
    readAppointment: "/portaluser/portaluser-appointment/read",
    manage: "/portaluser/portaluser/manage-offered-property",
    enum: "/app/enum/user"
  },
  properties: {
    get: "/portaluser/portaluser-website/home",
    read: (id: string) => `/portaluser/portaluser-website/read-one?id=${id}`,
    favorite: "/portaluser/portaluser-website/read-favourite-property",
    agent: "/portaluser/portaluser-website/contact-agent",
    updateFavorite: "/portaluser/portaluser-website/favourite-property"
  },
  website: {
    settings: "/websitesetting/websitesetting/view-websitesetting"
  }
};
