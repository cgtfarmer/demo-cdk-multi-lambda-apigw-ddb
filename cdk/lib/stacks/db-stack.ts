import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, Billing, Capacity, TableClass, TableV2 } from 'aws-cdk-lib/aws-dynamodb';

interface DbStackProps extends StackProps {
}

export class DbStack extends Stack {

  public readonly stateDdbTable: TableV2;

  public readonly residentDdbTable: TableV2;

  constructor(scope: Construct, id: string, props: DbStackProps) {
    super(scope, id, props);

    this.stateDdbTable = new TableV2(this, 'StateTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      // tableName: 'test-table-name' // Default: Generated by CFN
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS, // Slower + cheaper
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(1),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 1 }),
      }),
    });

    this.residentDdbTable = new TableV2(this, 'ResidentTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      // tableName: 'test-table-name' // Default: Generated by CFN
      tableClass: TableClass.STANDARD_INFREQUENT_ACCESS, // Slower + cheaper
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(1),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 1 }),
      }),
    });
  }
}
