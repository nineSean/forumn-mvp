import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

interface DatabaseStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class DatabaseStack extends cdk.Stack {
  public readonly instance: rds.DatabaseInstance;
  public readonly proxy: rds.DatabaseProxy;
  public readonly secret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    this.instance = new rds.DatabaseInstance(this, "ForumDb", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO
      ),
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      databaseName: "forum",
      credentials: rds.Credentials.fromGeneratedSecret("forum_admin"),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.secret = this.instance.secret!;

    this.proxy = this.instance.addProxy("ForumDbProxy", {
      secrets: [this.secret],
      vpc: props.vpc,
      requireTLS: false,
    });
  }
}
