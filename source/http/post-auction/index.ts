import arc, { HttpRequest } from "@architect/functions";
import assert from "assert";
import { createHandler } from "@architect/shared/handler";
import HttpError from "node-http-error";
import { verifyAuth } from "@architect/shared/auth";

type AuctionInput = {
  auctionId: number;
  userId: number;
  startingPrice: number;
  reservePrice?: number;
  endsAt?: number;
};

const validateAuctionBody = (req: HttpRequest): AuctionInput => {
  try {
    assert.equal(
      typeof req.body.auctionId,
      "number",
      "Expexted number body.auctionId"
    );
    assert.equal(
      typeof req.body.userId,
      "number",
      "Expected number body.userId"
    );
    assert.equal(
      typeof req.body.startingPrice,
      "number",
      "Expected number body.startingPrice"
    );
    if (req.body.reservePrice != null) {
      assert.equal(
        typeof req.body.reservePrice,
        "number",
        "Expected optional number body.reservePrice"
      );
    }
    if (req.body.endsAt != null) {
      assert.equal(
        typeof req.body.endsAt,
        "number",
        "Expected optional number body.endsAt"
      );
    }
    return req.body as AuctionInput;
  } catch (error) {
    throw HttpError(400, error.message);
  }
};

export const handler = createHandler(async (req: HttpRequest) => {
  const authUserId = await verifyAuth(req);
  const arcClient = await arc.tables();
  const docClient = arc.tables.doc;
  const auctionInput = validateAuctionBody(req);

  if (auctionInput.userId !== authUserId) {
    throw HttpError(400, "You can only start your own auction");
  }

  try {
    await docClient
      .put({
        TableName: arcClient.name("auction"), // Get full table name with lambda prefix
        Item: auctionInput,
        ConditionExpression: "attribute_not_exists(auctionId)",
      })
      .promise();

    return {
      statusCode: 201,
    };
  } catch (error) {
    if (/conditional request/i.test(error.message)) {
      throw HttpError(
        400,
        `Auction with id ${auctionInput.auctionId} already exists`
      );
    }
    throw error;
  }
});
