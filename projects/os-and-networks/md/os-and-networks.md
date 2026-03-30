# Introduction
This was my 2nd year coursework for operating systems and networks, which delved into packets, threading and low level design that needs to be considered for programming. We were tasked to implement a packet sniffer in C that captures live packets, parses different headers, detects 3 different types of attacks, and uses multithreading to process packets, outputting a report when the program terminates. We had to detect SYN flood attacks, ARP cache poisoning, and blacklisted HTTP requests. Here we will detail our implementation of this, and the reasonings behind our decisions. You can view the code in its entirity on the [GitHub page](https://github.com/Illuminarchie66/CS241-OS-and-Networks).

# Tasks
The goal of creating a packet sniffer was meaningfully broken up into 3 core elements, with packet sniffing, detection and multithreading. To work with this, we designed some additional data structures so that multithreading worked correctly without conflicts or race conditions.

## Data Structures
We implemented 3 small data structures to assist our program. A queue for threading, a dynamic array for holding IP addresses, and a struct for holding values for the final output report.

### Queue
This was the core of our threading. We implement a linked list queue for the packets. This is to decouple packet capture and packet analysis. The queue holds and stores the packets coming in, and when there is a free thread, we broadcast a signal to take a packet from the queue to analyse the next packet to be dequeued. The queue allows for one packet to be handled by one thread, ensuring data and computations remain consistent. 

We define the queue with a `struct` that allocates a fixed amount of memory, and defines a `head` and a `tail`. We then defined functions to work with it, passing it in as a parameter. We first defined `isempty()`, which checks if the `head` is pointing to `NULL`. Next we defined `enqueue()`, which works by creating a new node, getting the `tail` to point to it, then defining the new tail to be the new node, which points to `NULL`. Next is `dequeue()`, which pops off the queue's head and returns the element. It takes the `head` element, isolates the value, then takes what it is pointing to, and assigns that as the new head, returning the extracted value. Finally we defined a `destroy_queue()` which was used for memory cleanup, to avoid any memory leaks.

```c
struct queue *create_queue(void){ 
  struct queue *q=(struct queue *)malloc(sizeof(struct queue));
  q->head=NULL;
  q->tail=NULL;
  return(q);
}

void destroy_queue(struct queue *q){ 
  while(!isempty(q)){
    dequeue(q);
  }
  free(q);
}

int isempty(struct queue *q){ 
  return(q->head==NULL);
}

void enqueue(struct queue *q, u_char* item){ 
  struct node *new_node=(struct node *)malloc(sizeof(struct node));
  new_node->packet=item;
  new_node->next=NULL;
  if(isempty(q)){
    q->head=new_node;
    q->tail=new_node;
  }
  else{
    q->tail->next=new_node;
    q->tail=new_node;
  }
}

u_char *dequeue(struct queue *q){ 
  struct node *head_node;
  if(isempty(q)){
    return NULL;
  }
  else{
    head_node=q->head;
    q->head=q->head->next;
    if(q->head==NULL)
      q->tail=NULL;
    u_char* temp = head_node->packet;
    free(head_node);
    return temp;
  }
}

void printqueue(struct queue *q){
    if(isempty(q)){
        printf("The queue is empty\n");
    }
    else{
        struct node *read_head;
        read_head=q->head;
        printf("The queue elements from head to tail are:\n");
        printf("%s",read_head->packet);
        while(read_head->next!=NULL){
            read_head=read_head->next;
            printf("--> %s",read_head->packet);
        }
        printf("\n");
    }
}
```

### Dynamic Array
We also needed access to a dynamic array, to store unique IP addresses. We grow it using `realloc` when it reaches a max size, doubling the number of elements from the initial size (which is parameterized in the struct). This was designed to be very simple, a barebones implementation to store IP addresses that we could search through. We only defined `createArray()`, `addArray()`, `freeArray()` (to avoid memory leaks) and `inArray()` which performs a linear search to go an find the entered element. This works, however is not optimal as this requires an $O(n)$ search time. Ideally, we would use a hashset, however I did not want to go and implement one of those inside of C.   

```c
void createArray(Array *a, int initial){
  a->array = malloc(initial*sizeof(u_int32_t));
  a->size = initial;
  a->end = 0;
}

void addArray(Array *a, u_int32_t elem){
  if (a->end == a->size){
    a->size = (a->size)*2;
    a->array = realloc(a->array, a->size*sizeof(u_int32_t));
  }
  a->array[a->end] = elem;
  a->end = a->end + 1;
}

int inArray(Array *a, u_int32_t elem){
  for (int i=0; i<a->end; i++){
    if (a->array[i] == elem){
      return 1;
    }
  }
  return 0;
}

void freeArray(Array *a) {
  free(a->array);
  a->array = NULL;
  a->end = 0;
  a->size = 0;
}
```

## Packet Analysis
We use `pcap` to gain access to the incoming packets. We use 
```c
pcap_loop(handle, ..., callback, user_data)
```
which has the program lie in wait until a packet is sent. When it is sent, then `callback` is called, which a function which handles the header, the packet and the user's data. The `handle` is our network interface, which we do with:
```c
pcap_t *pcap_handle = pcap_open_live(interface, 4096, 1, 1000, errbuf);
```
where the interface is the network interface on our machine (device that sends/recieves network traffic), 4096 is max bytes per packet to capture, the 1 sets it to promiscuous mode to capture everything, and has a 1000ms timeout. Our callback function 
```c
void callback(u_char *args, const struct pcap_pkthdr* header,const u_char* packet)
{
    int verbose = (int) args[0];
    struct pcap_pkthdr head =*header;
    if (packet != NULL){
      dispatch(&head, packet, verbose);
    }   
}
```
takes in the args we provide it, like `verbose`, the packet header and the packet itself, handling null errors. The header has metadata of packet length and timestamp; the packet itself having the Ethernet, IP, TCP, and data. Note that the packet is a pointer to memory owned by `pcap`, which gets reused for the next packet, so it is not safe to keep long term. `dispatch()` sends the packet to by analysed. 

### Ethernet layer
Packets are comprised of data in a series of blocks of fixed lengths, which we can extract out as constants from imports like `#include <netinet/if_ether.h>`, `#include <netinet/ip.h>`, and `#include <netinet/tcp.h>`. These define much of the structure of packets, and make it a lot easier to extract out details and values. We first extract the Ethernet header, which we use the `eth_header` struct from [netinet/if_ether.h](https://sites.uclouvain.be/SystInfo/usr/include/netinet/if_ether.h.html). When we extract it, it automatically fills out from the byte stream. We then go and move the pointer along by `ETH_HLEN (=14)`, to point to the rest of the packet. We use this to determine if the packet is an ARP packet or IP packet, simply by extracting from the struct and comparing the type to `ETHERTYPE_ARP` and `ETHERTYPE_IP` respectively.

### ARP analysis
If we encounter an ARP packet, then we are to detect for ARP cache poisoning attempts. We first fill out the arphdr (ARP header) struct with the payload, allowing it to access its operation. If the operation is defined to be a reply (equals 2) then we track the response. We track this to prevent ARP cache poisoning, which works by an attacker sending fake ARP replies. 

ARP is what maps an IP address to a MAC address, and so our machine caches it. This is not authenticated though, so if a fake ARP reply is sent, then our machine can be misled to believe that the cache should be updated. So when we next send traffic to the router, it will actually send it to the attacker - who can read traffic, modify it, and forward to real router - effectively a man in the middle attack. It also can be traffic interception, to monitor activity, or just denial of service. ARP replies should be monitored as they typically follow a request. So if there are lots of unsolicited ARP replies with repeated updates to the same IP, it likely is an attack. For our coursework, we just needed to count ARP tickets of reply type, but in reality, more complex mechanisms are used to identify an ARP attack. 

### IP + TCP parsing
If it is not an ARP packet, then we want to check if it is an IP packet. Like before, we fill out the `ip` struct defined [here](https://sites.uclouvain.be/SystInfo/usr/include/netinet/ip.h.html), and we move the pointer along to look at the IP's payload. In the IP's header, we check if the protocol is equal to the TCP protocol, which allows us to identify the packets of interest to us. Once again, we fill in the `tcphdr` (TCP header) struct with the packet;s details. We find the length by extracting the header length from the IP header stored, and add 4 times the data offset as they are 4 byte words. We also move along the pointer, to point to the TCP payload.
```c
struct tcphdr *tcp_header = (struct tcphdr *)ip_payload;
int tcp_header_length = ((*(ip_payload + 12)) & 0xF0) >> 4;
tcp_header_length = 4*tcp_header_length;
```
This lets us perform SYN detection and HTTP inspection.

### SYN detection
Within the TCP header, we check if the packet in question is a SYN packet. We check if the SYN flag is 1, and all other flags are 0. This is where we increment the SYN counter, and add the IP address of the source to the list of unique incoming SYN addresses. This is where we used the dynamically growing array, maintaining a list of unique sources. This is done with respect to detecting SYN flood attacks. This relies on the TCP SYN-ACK handshake method that is used, where for normal interactions, a client sends a SYN request is sent to the server, the server replies with an acknowledgement SYN-ACK, and the client sends an acknowledgement ACK back. If the server is flooded with SYN packets, the machine is designed to expend its resources, filling with half open connections that fill up, slowing servers. The real world solution to this is to compare SYN vs completed connections ratio, adding timeouts to connections, and per IP rate limits.  

### HTTP inspection
With an IP ticket with TCP, we also check for the if the protocol is HTTP, aka the destination is 80. From here, we check if the payload includes a string from a blacklist of domains. For example, looking for `www.google.co.uk`. We check contains with `strstr((const char*)tcp_payload, domain)`, which checks if the payload string has the domain inside of it. In the event that one of them is contained, we increment the packets from that blacklist, and output the source and destination IPs. 
```c
void blackListOutput(struct ip * ip_header)
{
  //We use inet_ntoa() to convert our u_int32_t ip into an understandable output.
  printf("========= ====================\n");
  printf("Blacklisted URL violation detected\n");
  printf("Source IP address: %s\n", inet_ntoa(ip_header->ip_src));
  printf("Destination IP address: %s\n", inet_ntoa(ip_header->ip_dst));
  printf("==============================\n");
}
```
Checking HTTP payloads for certain domains is useful for detecting unauthorised or blocked web access on the network, such as parental controlsm corporate policy enforc ment or intrusion detection. Our current implementation is not thread safe, however for the sake of the coursework deadline, I assumed that there would not be a test requiring two or more threads to handle a blacklisted URL specificially. This is because `printf`  is not atomic, so multiple threads printing can jumble output; similar with `inet_ntoa()` using a shared buffer. We can make it thread safe using a mutex, that locks for a thread printing.

## Threading
Multithreading is used for multiple processes to be run in parallel with each other. They are multiple concurrent paths of execution, running independently while sharing the same memory space. On multicore systems this allows for parallel execution, and improved responsiveness. This lends itself to packet analysis, as we have many independent units of work - done on each packet. Not doing it sequentially gives us a big advantage. Threading does have limitations, in that we must make sure we avoid deadlocks, race conditions and prevent different threads from overriding each other by accessing the same memory at the same time, which we achieve with mutual exclusion (mutex) locks. 

For this program, we use threading to process network packets concurrently, with a thread pool approach. We have a fixed number of threads created at the start of the program (we define 4, but can be scaled up or down). Incoming packets are enqueued to the shared queue. The free threads are signalled to dequeue a packet and run the `analyse()` function. We do this in `dispact()`. This ensures threads are constantly busy, and that we don't need to waste overhead of creating a new thread per packet. We do the thread pool as opposed to generating one per packet, due to the number of packets being large and unpredictable, so thread creation/destruction overhead would be too damaging. Threadpools have the limitation of risking starved threads, which are not doing anything, and these are balanced in real applications dependent on traffic.

We use mutex locks to avoid race conditions with our shared data which is `valTracker`, a struct counting the values that are required of the program. We do this with `pthread_mutex_lock` and `pthread_mutex_unlock`, which is applied to the queue and to the valTracker. When our `callback()` calls `dispatch()`, the queue is locked, the packed it added, and then it is unlocked. This safely adds the packet to the shared resource.
```c
void dispatch(struct pcap_pkthdr *header,
              const unsigned char *packet,
              int verbose) {
  pthread_mutex_lock(&queue_mutex);
  enqueue(kuew, packet);
  pthread_cond_broadcast(&queue_cond);
  pthread_mutex_unlock(&queue_mutex);
}
```
Our threads are perpetually running with `thread_runner()` which locks the queue before accessing it to dequeue the next packet. If it is empty, it waits on a condition variable `pthread_cond_wait(&queue_cond,&queue_mutex)` until a pakcet is added, which prevents busy waiting, ensuring a thread only runs when there is work. When a packet is available, it will dequeue and unlock the mutex to make it available to other queues. 
```c
void * thread_runner(void* args) {
  u_char* packet = NULL;

  while(keepRunning){
    pthread_mutex_lock(&queue_mutex);
		while(isempty(kuew) && keepRunning){  
			pthread_cond_wait(&queue_cond,&queue_mutex);
		}
		packet = dequeue(kuew);

    pthread_mutex_unlock(&queue_mutex);
    if (packet != NULL){
      analyse(packet, 0);
    }
  }

  pthread_exit(NULL);
}
```

We could have used read/write locks, which introduces another state for separately reading or writing to the shared memory, but since we rarely read from memory, just modify it, it seemed to be unnecessary complexity.

## Report
When the user presses ctrl+c, it triggers the `signal_callback_handler` with `signal(SIGINT, signal_callback_handler)`. This firstly sets `keepRunning` to 0, so that the threads end, broadcasting the queue conditions so the loops break as well. It then rejoins the threads that have been made to avoid memory leakage, and provides an output report of SYN packets, unique SYN IPs, ARP responses, and URL blacklist violations. Finally it frees up the memory by destorying the queue, freeing the array and freeing the tracker. 
```c
void signal_callback_handler(int signum) {
  keepRunning=0;
  pthread_cond_broadcast(&queue_cond);

  for (int i = 0; i < numThreads; ++i) {
    pthread_join(tid[i], NULL);
  }
  
  printf("\n");
  printf("Intrusion Detection Report:\n");
  printf("%d SYN packets detected from %d unique IPs (syn attack)\n", tracker->syn_packets, syn_tracker.end);
  printf("%d ARP responses (cache poisoning)\n", tracker->arp_packets);
  printf("%d URL Blacklist violations (%d google and %d facebook)", (tracker->google_packet+tracker->facebook_packet), tracker->google_packet, tracker->facebook_packet);
  printf("\n");

  destroy_queue(kuew);
  freeArray(&syn_tracker);
  free(tracker);
  exit(0);
}
```

## Testing
The main area to test once having tested all of the conditions set, using the given commands and
built in scripts for SYN, ARP and blacklisted URLs, we finally began testing some more of the weird cases. Firstly for SYN, we tested if it would only gather unique IPs. When using the command given it is a random source entry, however if we remove that flag, it defaults to all of them being the same packet IP, so the answer would give 100 SYN packets, and 1 unique IP, which it did. The next tests were stress tests performed on the SYN packets, which was changing the command to send upwards of 10000 packets, which a non threaded system would be unable to easily handle. This was additionally done for ARP packets, both returning their expected outputs. We also tested the extreme case of multiple blacklisted URLs across different threads, which resulted in the garbled text we predicted earlier. The solution is to have an output mutex, but we did not have time to fully implement this. 

# Evaluation
Overall this coursework was an interesting introduction to packets and multithreading. There were many areas I could improve, in particular designing a hashset in C in place of my array, and utilising mutex locks for outputting to the console. In my original solution, I also did not copy the packet over from `pcap`, meaning it would be overwritten. Additionally, it would have been good to turn my results into an actual system to identify attacks, instead of just reporting the number of packets that fit the given descriptor. Threading as well is a particularly fascinating problem, for the opportunities it can provide with developing faster systems and programs, while maintaining the difficult balance of availability of threads. The greatest difficulty was working with the strictness of C, and the confusing use of pointers, addresses and memory allocation. 