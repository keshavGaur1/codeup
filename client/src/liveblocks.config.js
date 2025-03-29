import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

export const client = createClient({
  publicApiKey: "pk_dev_2ldi8m4nI_Vmu5O84bBn-mzqVJQYamYcKGDK9a6dUyjinvwlZvN-HS5RsKJzJmlX"
});

// Create & export room context
export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
  useBroadcastEvent,
  useEventListener,
  useStorage,
  useMutation,
  useSelf,
  useStatus,
  useLostConnectionRecovery,
} = createRoomContext(client);

// Define initial storage state
export const INITIAL_STORAGE = {
  content: "",
  cursor: null,
};