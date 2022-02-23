const S3 = require("aws-sdk/clients/s3");

const client = new S3({
  endpoint: "http://localhost:9000",
  credentials: {
    accessKeyId: "username",
    secretAccessKey: "password",
  },
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const params = {
  Bucket: "json-bucket",
  Key: "neki.json",
  ExpressionType: "SQL",
  Expression: "SELECT 'hello' FROM S3Object",
  InputSerialization: {
    JSON: {
      Type: "DOCUMENT",
    },
  },
  OutputSerialization: {
    JSON: {
      RecordDelimiter: ",",
    },
  },
};

client.selectObjectContent(params, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const eventStream = data.Payload;

  eventStream.on("data", (event) => {
    if (event.Records) {
      process.stdout.write(event.Records.Payload.toString());
    } else if (event.Stats) {
      console.log(`Processed ${event.Stats.Details.BytesProcessed} bytes`);
    } else if (event.End) {
      console.log("SelectObjectContent completed");
    }
  });

  eventStream.on("error", (err) => {
    switch (err.name) {
    }
  });

  eventStream.on("end", () => {});
});
