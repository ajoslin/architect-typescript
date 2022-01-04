import arc, { HttpRequest } from "@architect/functions";
import { createHandler } from "@architect/shared/handler";

export const handler = createHandler(async (req: HttpRequest) => {
  const { auctionId } = req.pathParameters;
  const client = await arc.tables();
  const auction = await client.auction.get({ auctionId: +auctionId });

  return {
    statusCode: 200,
    headers: {},
    json: auction,
  };
});
