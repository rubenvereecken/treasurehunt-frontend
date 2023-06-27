import { ApolloError, gql, useQuery } from "@apollo/client";

// Grafbase doesn't support live queries on relationships yet
// const GetRecentMessagesQuery = gql`
//   query GetRecentMessages($last: Int, $roomSlug: String) @live {
//     room(by: { slug: $roomSlug }) {
//       id
//       slug
//       name
//       messages(last: $last) {
//         edges {
//           node {
//             id
//             username
//             avatar
//             body
//             likes
//             createdAt
//           }
//         }
//       }
//     }
//   }
// `;

export type IMessage = {
  id: string;
  username: string;
  avatar?: string;
  body: string;
  createdAt: string;
  room: {
    id: string;
    slug: string;
  };
};

export type IRoom = {
  id: string;
  slug: string;
  name: string;
};

const GetRecentMessagesQuery = gql`
  query GetRecentMessages($last: Int) @live {
    messageCollection(last: $last) {
      edges {
        node {
          id
          username
          avatar
          body
          likes
          createdAt
          room {
            slug
            id
          }
        }
      }
    }
  }
`;

const GetRoomQuery = gql`
  query GetRoom($slug: String) @live {
    room(by: { slug: $slug }) {
      id
      slug
      name
    }
  }
`;

export function useMessages({ roomSlug }: { roomSlug: string }): {
  loading: boolean;
  error?: ApolloError;
  data: IMessage[];
} {
  const { loading, error, data } = useQuery<{
    messageCollection: { edges: { node: IMessage }[] };
  }>(GetRecentMessagesQuery, {
    variables: {
      last: 100,
    },
  });

  if (!data) return { loading, error, data: [] };

  const messages: IMessage[] = (data.messageCollection.edges ?? [])
    .map((edge) => JSON.parse(JSON.stringify(edge.node)))
    .filter((msg) => msg.room.slug == roomSlug);

  // mVessages.map((msg) => {
  //   /** @ts-ignore */
  //   msg.room = { slug: "alpha", id: "test" };
  // });

  return { loading, error, data: messages };
}

export function useRoom({ roomSlug }: { roomSlug: string }): {
  loading: boolean;
  error?: ApolloError;
  data?: IRoom;
} {
  const { loading, error, data } = useQuery<{ room: IRoom }>(GetRoomQuery, {
    variables: {
      slug: roomSlug,
    },
  });

  if (!data) return { loading, error, data: undefined };

  const room: IRoom = data.room;

  return { loading, error, data: room };
}
