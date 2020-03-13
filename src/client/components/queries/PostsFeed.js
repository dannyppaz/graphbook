import { Fragment } from "react";

const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int) {
    postsFeed(page: $page, limit: $limit) {
      posts {
        id
        text
        user {
          avatar
          username
        }
      }
    }
  }
`;

export const PostsFeedQuery = ({ variables }) => {
  const getVariables = () => {
    var query_variables = {
      page: 0,
      limit: 10
    };

    if (typeof variables !== typeof undefined) {
      if (typeof variables.page !== typeof undefined) {
        query_variables.page = variables.page;
      }
      if (typeof variables.limit !== typeof undefined) {
        query_variables.limit = variables.limit;
      }
    }

    return query_variables;
  };

  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
    variables: getVariables()
  });

  if (loading) return <Loading />;
  if (error)
    return (
      <Error>
        <p>{error.message}</p>
      </Error>
    );
  if (!data) return null;

  const { postsFeed } = data;
  const { posts } = postsFeed;

  return <Fragment>{render({ posts, fetchMore })}</Fragment>;
};
