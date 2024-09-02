import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription, timestamp } from 'rxjs';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
interface Question {
  text: string;
  answer?:{
    summary: string;
    details: string;
    images: string[];
    pages: string[];
    videos: string[];
    graphs: string;
  };
}

interface Message {
  text: string;
  isUser: boolean;
}
interface QuestionAnswer {
timestamp: Timestamp;
  question: string;
  response: {
    summary: string;
    details: string;
    images: { src: string ,description?: string}[];
    pages: { page_number: string, page_src: string }[];
    videos: { src: string }[];
    graphs: string;
  };
  selectedTab:string;
  
  
  
}

@Component({
  selector: 'app-chatbotpage',
  templateUrl: './chatbotpage.component.html',
  styleUrls: ['./chatbotpage.component.css']
})
export class ChatbotpageComponent implements OnDestroy, OnInit {
  suggestedQuestions: Question[] = [
    { text: "Can I wear a seat belt by keeping child in my lap?" },
    { text: "How to wear a seat belt?" },
    { text: "How to check the engine oil level?" },
    { text: "How to Inspect Tyre?" },
    { text: "Proper usage of shifting gears?" },
    { text: "How to avoid clut pad damages?" },
    { text: "How to Check the Coolant Level?" },
    { text: "How to Use Air Conditioning System Efficiently?" },
    { text: "How to adjust the rearmirror in night driving?" }
  ];
  newQuestion: string = '';
  currentQuestion: string | null = null;
  isLoading: boolean = false;
  
  notLoading: boolean = true;
  activeTab: string = 'details';
  messages: Message[] = [];
  API_response:any={
  details: "Absolutely not. It is lorem lap while wearing a seat belt. [1]  The seat belt is designed for one person and should never be used for more than one occupant. [1]  Holding a child on your lap while the vehicle is in motion is also prohibited. [1]  In the event of an accident, the child would not be adequately supported and could suffer serious injury. [1]  Always secure children in the rear seat using age-appropriate car seats or booster seats. \n",
  images: [
      {
          src: "https://storage.googleapis.com/maruti-suzuki-user-manual/images/page_4_i_1.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=all-services%40blp-iai.iam.gserviceaccount.com%2F20240719%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240719T092131Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=379fad0ff3be5e34093e1044d671241f0c00b5ecb322171762ea8a4909561a459312037f1f5603012545f93415d36669e8b0cd262fa0cfe94e6c86cb77ad7aad0a5e765c5fb10e408aee73400260f048a762ee3285c9c4d443174c6c4706b81ea3cfb88b21af73d71b779ae5298b8bffcf2e6938fa3e5e5b38048b726aa031b1ab7d4d8a1a39cfe4f3c44694b26282b6a2451c9fae5380274cd6d939af1f81adc5c120761ae71730889d6f72ca92f51e6bd386c7becbe88fbcebb97b1a0f4ff380852399296c1a44c340a2c6bce351d874afe193ff1625472514f1668e64429e34bd9ff1796810ff1a971093109822bcf0b0b979555cd076e166215af7867951"
      },
      {
          "src": "https://storage.googleapis.com/maruti-suzuki-user-manual/images/page_4_i_2.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=all-services%40blp-iai.iam.gserviceaccount.com%2F20240719%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240719T092131Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=72ec4ef107e5a533c6d88907b3e4134671005241b5c0ebecb0362f90e60f151609f6afdf1ce232b279571c0eb36072ffb1ec75f775149329b03f1099a1397eb320c9809d6e5b8deb1d313da07e9a5561e2c4b8a812b35fa96868a279d3501f92d6faed4052f6b9de98b2c8fe3a41240d0ac37381f4b80601725214ad9a85e93d25da0eae08d46b6a74bef2f52b2782e2b3786f764730e5bc52352dce52aea4febc5c6ccb9eef872bb7210d0177710654523d6fe38fd30cbf4b5efaabe752f26f7a4a8e870db5026fd18754543f647804a94ac32a681baa9059d3ec519850bf72cedc7b326f5e53d391edc2e6464d97c25b5470892b0288b3b331eba3ff974a80"
      },
    
   
  ],
  pdf_images: [
      {
          page_number: "4",
          page_src: "https://storage.googleapis.com/maruti-suzuki-user-manual/pdf_images/page_4.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=all-services%40blp-iai.iam.gserviceaccount.com%2F20240719%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240719T092131Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=5c0a330e4a840ba42a11d0eab676ce87799155c325db12243720323f98d541fe5edd29c922cd2502c8fed4ae3b3dfe1613677c9974b844995595fcbf82ea9fd31e878015a943bcde096eb1c3b9121fa8b386184ee4468ab2ce215841c59c588741bacb3f8c3352cdef3d1767f54cd42b87d8be446dbe48846fdde73e9186316d9982502fc0352e5ba7b39d43b8efcff893c4b4f72a3b19f5d5b5c79c75dfe4326a8ccf449c6310db659626d284fbb692be72399a4c0d0271b9a15ec6df6adccd05cef5934fa52e4c195fcab7347376b12ee896f33a903057c11c7805286e623c1391070fc4f150154b005a9346ec1afc3849ac664cd1282ab9237f6785daa7f8"
      },
      {
        page_number: "37",
          "page_src": "https://storage.googleapis.com/maruti-suzuki-user-manual/pdf_images/page_37.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=all-services%40blp-iai.iam.gserviceaccount.com%2F20240719%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240719T092132Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=39004d6743d9628ff774f1d4aa0fdd74c5cdb7fe2ea6da62a36aae8164d8d903014ac96a6863b9e2345d0dce316c4168bc8ef2f15992e12d7e0c9d83c7abc7910238c5cd50303738a0051942862ccf37dc3c27ab04084b49dfdbb4baf1d7c045b13ea3069b56ba21a306758f105bc222c3067e6b06bb7f56b6d9c5d4dcb4afd8b9fcf4f58d1a4859a32798e8ed67e1a72125348c9f88b7b4768ed337059885952bca861687623b2fb6cc6750fdfcef837c650e9bcf6a4e1f52d68e9af606e7ab6d020403feb5fa3586cdaf7345538a429669a79231e0902f0af4ea3d098d996b6ac64b5c94b9235e4d6809793abd344fd6a9fa9e6122bd8effe5a165f44befbd"
      },
      {
        page_number: "52",
          "page_src": "https://storage.googleapis.com/maruti-suzuki-user-manual/pdf_images/page_52.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=all-services%40blp-iai.iam.gserviceaccount.com%2F20240719%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240719T092132Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=3cf9e023d48212be54619c8951a18c022c7fe216c55679731389c7bc7383b7b3adcc479b3811f41e4dd326a5f566a06d81b02d361c0d561aa7797656a273d9290df155bbc57e525ad3737beee6513e5f6ca08238a56aa0b758d6ac4cb18bef8cdb5a11dab601367f50f3e8d2d1975797ceea5234f121d70cf1d0ac8cb068262982b4d39dde9a8b97ccc3d941e5c329c73834648ec48b6912794729a26a949126117a608a66806ac249f2e8313a72fff0b20c2aca5c7a9d4d6c4a1bc59ded46951005e1f680bd5ecc2d698995cf3522e673b54cdb8070c921bfcd67b10e09823eb9dfb7ed037cd54bc8a1ddde4e8cb2d0960d9be23107bfc02214c3a22926f6e9"
      }
  ],
  status: "success",
  summary: "No, you should not hold a child on passenger\u2019S\nlap when the vehicle is in motion.",
  videos: [
      {
          "src": "https://www.youtube.com/watch?v=pYuqLZxcz3A&pp=ygVoUHJvdmlkZSBhIFlvdVR1YmUgdmlkZW8gYWJvdXQgdGhlIGZvbGxvd2luZyBxdWVzdGlvbiA6Q2FuIEkgd2VhciBhIHNlYXQgYmVsdCBieSBrZWVwaW5nIGNoaWxkIGluIG15IGxhcD8%3D"
      },
      {
          "src": "https://www.youtube.com/watch?v=c2o3iHgBHgg&pp=ygVoUHJvdmlkZSBhIFlvdVR1YmUgdmlkZW8gYWJvdXQgdGhlIGZvbGxvd2luZyBxdWVzdGlvbiA6Q2FuIEkgd2VhciBhIHNlYXQgYmVsdCBieSBrZWVwaW5nIGNoaWxkIGluIG15IGxhcD8%3D"
      }
  ],
}

  question_answer_list:QuestionAnswer[]=[];
  private subscription: Subscription | undefined;
  userPrompt:string='';
  selectedTab:string='details';
  videoUrl: SafeResourceUrl;
  responses:any={
    summary:'',
    details:'',
    images:[],
    pages:[],
    videos:[],
    graphs:''
  };
  
  

  constructor(private apiService: ApiService, private sanitizer:DomSanitizer,private firestore:AngularFirestore) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl('https://www.youtube.com/watch?v=pYuqLZxcz3A'));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
      this.getQuestions();
  }

  addQuestion() {
    if (this.newQuestion.trim()==='') {
      return;
    }
    const timeStamp=Timestamp.now();

    const data={
      question:this.newQuestion,
      response:this.responses,
      timeStamp:timeStamp,
      selectedTab:'details'
    };

    this.firestore.collection('questions').add(data)
    .then(()=>{
      console.log('Question and response saved successfully');
    })
    .catch(error=>{
      console.error('Error saving question and response:',error);
    });
    
    this.messages.push({ text:this.newQuestion, isUser: true });
    this.isLoading = true;
    this.notLoading = false;
    this.getAPIResponse(this.API_response)
    this.newQuestion = '';
   
  }
  getAPIResponse(response:any){
      this.isLoading=true;
      this.notLoading=false;
      console.log('API response:', response);
      
    
      if(response){
        this.responses={
      summary:response.summary || 'No summary available',
      details:response.details || 'No details available',
      images:response.images || [],
      pages:response.pdf_images || [],
      videos:response.videos || [],
      graphs:response.graphs || 'No graphs available'
     };

    // this.responses.videos = response.videos.map((video: any) => {
    //   const embedUrl=this.getEmbedUrl(video.src);
    //   return embedUrl;
    const videos = response.videos.map((video: { src: string }) => {
      return { src: this.sanitizer.bypassSecurityTrustResourceUrl(this.getEmbedUrl(video.src)) };
    });

     const obj: QuestionAnswer = {
      question: this.newQuestion,
      response: this.responses,
      selectedTab: this.activeTab,
      timestamp:Timestamp.now()

      
    };
         console.log(obj,'///////////////////s')
        this.question_answer_list.unshift(obj);
  }

    else{
      console.error('Error fetching data:');
      this.isLoading = false;
      this.notLoading = true;
      this.messages.push({ text: 'Ask.AI: Error fetching answer. Please try again later.', isUser: false });
    }
  }

  handleSuggestedQuestionClick(question: string) {
    
    this.newQuestion = question;
    // this.question_answer_list;
    this.addQuestion();
  
}

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }
  selectTab(index:number,tab:string){
    if (index >= 0 && index < this.question_answer_list.length) {
      this.question_answer_list[index].selectedTab = tab;
    }
  //   console.log(`Tab selected: ${tab}`); // Debugging output
  // this.selectedTab = tab; // Update selected tab
  }
  getEmbedUrl(url: string): string {
    const videoId = this.getVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}`:'';

  }

  getVideoId(url: string): string|null {
    const match = url.match(/[?&]v=([^?&]+)/);
    return match ? match[1] : null;
  }
  getQuestions(){
    this.firestore.collection<QuestionAnswer>('questions').valueChanges().subscribe((questions:QuestionAnswer[])=>{
      this.question_answer_list=questions.sort((a,b)=>b.timestamp.seconds-a.timestamp.seconds);
    });
  }
  formatTimestamp(timestamp:Timestamp):string{
    return moment(timestamp.toDate()).format('YYYY-MM-DD:mm:ss');
  }
}
