using System;
using Confluent.Kafka;
using OPCAutomation;
using System.Text.Json;

class Program { 
    static OPCServer server;
    static OPCGroup group;
    static IProducer<string, string> producer;

    static void Main() {
        var config = new ProducerConfig { BootstrapServers= "localhost:9094" , ClientId= "opc-producer" };
        producer = new ProducerBuilder<string, string>(config).Build();

        Console.WriteLine("Connecting to OPC Server...");
        server = new OPCServer();
        server.Connect("Matrikon.OPC.Simulation.1");

        OPCGroups groups = server.OPCGroups;
        group = groups.Add("MyGroup");
        group.IsActive = true;
        group.IsSubscribed = true;
        group.UpdateRate = 1000;

        OPCItems items = group.OPCItems;
        items.AddItem("Random.Real8", 1);

        group.DataChange += Group_DataChange;

        Console.WriteLine("Subscribed to Random.Real8");
        Console.WriteLine("Press Enter to exit...");
        Console.ReadLine();

        group.DataChange -= Group_DataChange;
        server.Disconnect();
    }
    private static void Group_DataChange(
        int transactionId, int NumItems,
        ref Array ClientHandles, ref Array ItemValues,
        ref Array Qualities, ref Array TimeStamps)
    {
        for (int i = 1; i <= NumItems; i++) { 
            var data = new {
                handle = ClientHandles.GetValue(i),
                value = ItemValues.GetValue(i),
                quality = Qualities.GetValue(i),
                timeStamp = TimeStamps.GetValue(i)
            };
            string json = JsonSerializer.Serialize(data);
            producer.Produce("opc-logs", new Message<string, string>
            {
                Key = data.handle.ToString(),
                Value = json
            });
            Console.WriteLine($"Sent to Kafka: {json}");
        }
    }

}



