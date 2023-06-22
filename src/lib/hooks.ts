import { ApolloError, gql, useQuery } from "@apollo/client";
import type {
  Message as IMessage,
  RoomAndMessages,
} from "@/components/message";

const GetRecentMessagesQuery = gql`
  query GetRecentMessages($last: Int, $roomSlug: String) @live {
    room(by: { slug: $roomSlug }) {
      id
      slug
      name
      messages(last: $last) {
        edges {
          node {
            id
            username
            avatar
            body
            likes
            createdAt
          }
        }
      }
    }
  }
`;

export function useRoomAndMessages({ roomSlug }: { roomSlug: string }): {
  loading: boolean;
  error?: ApolloError;
  data?: RoomAndMessages;
} {
  const { loading, error, data } = useQuery<{
    room: {
      id: string;
      slug: string;
      name: string;
      messages: { edges: { node: IMessage }[] };
    };
  }>(GetRecentMessagesQuery, {
    variables: {
      last: 100,
      roomSlug: roomSlug,
    },
  });

  if (!data || !data.room) return { loading, error, data: undefined };

  const room = data.room;
  const messages: IMessage[] = (room.messages.edges ?? []).map(
    (edge) => edge.node
  );

  const out: RoomAndMessages = {
    id: room.id,
    slug: room.slug,
    name: room.name,
    messages,
  };

  return { loading, error, data: out };
}
