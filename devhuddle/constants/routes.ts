// centralized place for defining routes in the application
// If any routing changes need to be made, it can be directly done here

const ROUTES = {
    HOME: '/',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    PROFILE: (id: string) => `/profile/${id}`,
    TAG: (_id: string) => `tags/${_id}`,
    ASK_QUESTION: "/ask-a-question",
    COLLECTION: '/collection',
    COMMUNITY: '/community',
    TAGS: '/tags',
    JOBS: '/jobs',
    QUESTION: (_id: string) => `questions/${_id}`,
    SIGN_IN_WITH_OAUTH: 'signin-with-oauth',
};

export default ROUTES;