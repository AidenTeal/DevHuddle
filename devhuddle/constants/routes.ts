// centralized place for defining routes in the application
// If any routing changes need to be made, it can be directly done here

const ROUTES = {
    HOME: '/',
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    PROFILE: (id: string) => `/profile/${id}`,
    TAGS: (_id: string) => `tags/${_id}`,
    ASK_QUESTION: "/ask-a-question",
    QUESTION: (_id: string) => `questions/${_id}`,
};

export default ROUTES;