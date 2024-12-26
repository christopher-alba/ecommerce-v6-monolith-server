import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoClient, ServerApiVersion } from 'mongodb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.ADMINAPP_ORIGIN, process.env.CLIENT_ORIGIN],
  });
  await app.listen(process.env.PORT ?? 3000);

  const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_ORIGIN}/?retryWrites=true&w=majority&appName=${process.env.DATABASE_APP_NAME}`;
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

bootstrap();
