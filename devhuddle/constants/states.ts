import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
    title: "No Data Found",
    message: "There is no data to display.",
    button: {
        text: "Add Data",
        href: ROUTES.HOME,
    }
};

export const DEFAULT_ERROR = {
    title: "Oops! Something went wrong",
    message: "We are unable to process your request at the moment. Please try again later.",
    button: {
        text: "Go Back",
        href: ROUTES.HOME,
    }
};

export const EMPTY_QUESTION = {
    title: "No Questions Yet!",
    message: "Be the first to ask a question.",
    button: {
        text: "Ask a Question",
        href: ROUTES.ASK_QUESTION,
    }
};

export const EMPTY_TAGS = {
  title: "No Tags Found",
  message: "The tag cloud is empty. Add some keywords to make it rain.",
  button: {
    text: "Create Tag",
    href: ROUTES.TAGS,
  },
};

export const EMPTY_COLLECTIONS = {
  title: "Collections Are Empty",
  message:
    "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
  button: {
    text: "Save to Collection",
    href: ROUTES.COLLECTION,
  },
};