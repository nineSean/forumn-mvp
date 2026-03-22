import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NetworkStack } from "../lib/network-stack";
import { DatabaseStack } from "../lib/database-stack";
import { ApiStack } from "../lib/api-stack";

const app = new cdk.App();

const network = new NetworkStack(app, "ForumNetworkStack");
const database = new DatabaseStack(app, "ForumDatabaseStack", {
  vpc: network.vpc,
});
new ApiStack(app, "ForumApiStack", {
  vpc: network.vpc,
  database: database.instance,
  databaseProxy: database.proxy,
  databaseSecret: database.secret,
});
