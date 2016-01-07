
/**** Snake Game by Abhinav Faujdar *****/
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_PCD8544.h>

Adafruit_PCD8544 display = Adafruit_PCD8544(7, 6, 5, 4, 3);  //Initialise display object

// pin 7 - Serial clock out (SCLK)
// pin 6 - Serial data out (DIN)
// pin 5 - Data/Command select (D/C)
// pin 4 - LCD chip select (CS)
// pin 3 - LCD reset (RST)


#define MAX_WIDTH 84        //display 84x48
#define MAX_HEIGHT 48
#define RECV_PIN 11

boolean dl,dr,du,dd;   // to check in which direction the snake is currently moving

int x[100],y[100],i,slength,tempx,tempy,xx,yy;
int xegg,yegg;
int freq,tb;
int l,r,u,d,p;
unsigned long time;
int score=0,flag;
int command;

void only_print(String s,int p_x,int p_y,double t_size){
    display.setTextSize(t_size);          //Initial Display
  display.setTextColor(BLACK);
  display.setCursor(p_x,p_y);
  display.print(s);
  display.display();
}

void initial_state(){
  
   display.clearDisplay();
  time = 280;
  flag = 0;
  tempy = 10;
  tempx = 27;
  dl=false,dr=false,du=false,dd=false;
    command = 2;
    score=0;
    slength=8;                 //Start with snake length 8
  
  xegg=(display.width())/2;  
  yegg=(display.height())/2;
  
    for(i=0;i<=slength;i++)      //Set starting coordinates of snake
      {
        x[i]=25-3*i;
        y[i]=10;   
      }

      
      redraw();
}



void setup()
{

  digitalWrite(12, HIGH); //We need to set it HIGH immediately on boot
  pinMode(12,OUTPUT);     //We can declare it an output ONLY AFTER it's HIGH
  
  Serial.begin(9600);         //Begin Serial Communication
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  display.begin();
  
   
  
  
  display.setContrast(60);
  
  initial_state(); 
}





        
//Movement Begins after here
  String inString = "",sString="",u_name="Robo";

void process_command(){
   if (sString.substring(0,3) == "s_n") {  
    
      if(sString.length()<20)
      u_name = sString.substring(3);
      else u_name = "max15CH";
      display.clearDisplay();
      only_print("Welcome",5,5,1.85);
      only_print(u_name,0,20,1.85);
      delay(3000);
      display.clearDisplay();
  } 
}

void process_serial(){
       // Read serial input:
  while (Serial.available() > 0) {
    int inChar = Serial.read();
    if (isDigit(inChar)) {
      inString += (char)inChar;
    }else{
      sString += (char)inChar;
    }
    if (inChar == '\n') {
      command = inString.toInt();
      process_command();
      sString = inString = "";
    }
  }
}
 
void loop()   
{
   process_serial();
   movesnake();    //This is called endlessly       
}

 void process_move(){
            if(dr==true){tempx=x[0]+3;tempy=y[0];}      // so the snake moves one step in the direction it is moving currently
           if(dl==true){tempx=x[0]-3;tempy=y[0];}      //The new coordinates of head of snake goes in tempx,tempy
           if(du==true){tempy=y[0]-3;tempx=x[0];}
           if(dd==true){tempy=y[0]+3;tempx=x[0];}  
 }

void movesnake()
{
  if(flag==0)
    direct(); 

  if(millis()%time==0)     //this condition becomes true after every 'time' milliseconds...millis() returns the time since launch of program
    {
           
           
         if(flag==0)                                   //flag 0 means no directional key has been pressed in the last 'time' milliseconds
         {
            process_move();
         }else       
       flag=0;  
       
          checkgame();                              //Check if snake has met egg or coincided with itself
          checkegg();
          
     if(tempx<=0){tempx=84+tempx;}     //If the new coordinates are out of screen, set them accordingly
     if(tempx>=84){tempx=tempx-84;}
     if(tempy<=0){tempy=48+tempy;}
     if(tempy>=48){tempy=tempy-48;}
    
     for(i=0;i<=slength;i++)        //Change the coordinates of all points of snake
      {
       xx=x[i];
       yy=y[i]; 
       x[i]=tempx;
       y[i]=tempy;
       tempx=xx;
       tempy=yy;
      }
      
    drawsnake();           //Draw the snake and egg at the new coordinates
    }
}

void game_over(){
        
        Serial.print("g_o");
        Serial.println(score);
      delay(800);
      display.clearDisplay();
      display.setTextColor(BLACK);       
      display.setTextSize(1);
      display.setCursor(20,5);
      display.print("Game Over");
      display.setCursor(15,15);
      display.print("Score: ");
      display.print(score);
      display.setCursor(15,25);
      display.print("Thanks");
      display.setCursor(12,35);
      display.print(u_name);
      
      display.display();
      delay(2000);
      
      
      display.clearDisplay();
      initial_state();     
      redraw();              //Restart game by drawing snake with the resetted length and score
}

void checkgame()       //Game over checker
{
  for(i=1;i<slength;i++)               //Checking if the coordinates of head have become equal to one of the non head points of snake
  {
    if(x[i]==x[0] && y[i]==y[0])
    {      
      game_over();
    }
  }

}

void checkegg()      //Snake meets egg
{
  if(x[0]==xegg or x[0]==(xegg+1) or x[0]==(xegg+2) or x[0]==(xegg-1))      //Snake in close vicinity of egg
  {
    if(y[0]==yegg or y[0]==(yegg+1) or y[0]==(yegg+2) or y[0]==(yegg-1))
    {
      score+=1;                       //Increase length,score and increase movement speed by decreasing 'time'
      slength+=1;
      if(time>=190)
      {time-=20;}
      
      display.fillRect(xegg,yegg,3,3,WHITE);      //Delete the consumed egg
      
      display.display();
      
      
      xegg=random(1,80);              //Create New egg randomly
      yegg=random(1,40);
    }
  }
}  
     
      
void direct()                  //Check if user pressed any keys and change direction if so
{
  dl = command ==1;
  du = command==3;
  dr = command ==2;
  dd = command==4;
  process_move();
  flag = (command>0 && command<4);
  
  if(command==5)               //Pause game for 5 seconds
  {
  command = 0;
  display.clearDisplay();
  
  display.setTextColor(BLACK);
  for(i=5;i>0;i--)
    {
     display.setCursor(25,10); 
     display.setTextSize(1);
     display.print("PAUSED");
     display.setCursor(40,30);
     display.print(i);
     display.display();
     delay(1000);
     display.clearDisplay();
    } 
    redraw();          //Redraw the snake and egg at the same position as it was 
  }else if(command == 6){
       digitalWrite(12, LOW);
  }else if(command == 7){//game over by time or something else
      game_over();
  }
}


void drawsnake()        //Draw snake and egg at newly changed positions
{
  display.fillRect(xegg,yegg,3,3,BLACK);       //Draw egg at new pos
  
  display.drawCircle(x[0],y[0],1,BLACK);       //Draw new head of snake
  display.drawCircle(x[slength],y[slength],1,WHITE);   //Delete old tail of snake
  
  display.display();
        
}

void redraw()   //Redraw ALL POINTS of snake and egg
{
  display.fillRect(xegg,yegg,3,3,BLACK);
  for(i=0;i<slength;i++)
     {
     display.drawCircle(x[i],y[i],1,BLACK);
     
     }
     display.display();
}     
     
     
       

   

