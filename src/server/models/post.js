const postSchema = {
  title: "post schema",
  description: "describes a simple post",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    text: {
      type: "string"
    }
  },
  required: ["text"]
};

export { postSchema };
