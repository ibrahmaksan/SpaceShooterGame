
// Ibrahim Aksan - 203 608 59 039

const ctx = document.getElementById("myCanvas"); // Buradaki tüm işlemler dom işlemleri için html ile bağlanyı için yapıldı.
const tablo = document.querySelector(".skor");
const tablo2 = document.querySelector(".asama");


ctx.width = 900;
ctx.height = 600; 
const c = ctx.getContext('2d');

c.fillStyle = "black";
c.fillRect(0,0,900,600);


const image_player = new Image(); // oyuncu resmi için
image_player.src = "./images/uzay_gemisi.png"

const image_uzayli = new Image(); // uzaylı resmi için
image_uzayli.src = "./images/uzayli.jpg"

const gun_audio= new Audio(); // laser gun sesi
gun_audio.src = "./images/laser.mp3"

const bomb = new Audio(); // uzayli patlama sesi
bomb.src = "./images/bomb.mp3"


let score = 0; // skor ve aşamalar tutulacak.
let asama = 1;

let mermiler = []; // dusman ve mermiler için listeler.
let dusmanlar = [];
let dusman_hizi = 3;
let speed = 0;
let direction = 0;

let pozisyon_x = 435; // oyuncu gemisi için koordinatlar.
let pozisyon_y = 555;

tablo.innerHTML = "SKOR: " + score; 
tablo2.innerHTML = "AŞAMA: " + asama; 

alert("Oyuna başlamak için tamama tıklayınız.");

document.addEventListener("keyup",hareket); // tuslara basildiğinda hareket sağlanır.

setInterval(map_update,1000/60); // 60 fps olması için 1000/60 yaptım.

function map_update(){ // her seferde haritadaki görsel değişimleri yapacak fonksiyon.
   
    if(score>=10 && asama == 1){
        asama+=1;
        dusman_hizi+=2;
        speed+=3;
    }

    if(score>30 && asama == 2){
        asama+=1;
        dusman_hizi+=4;
        speed+=3;
    }

    if(score>60 && asama == 3){
        asama = 4;
    }

    tablo.innerHTML = "SKOR: " + score; // skor ve aşama yazılacak.
    tablo2.innerHTML = "AŞAMA: " + asama; 

    c.fillStyle = "#0E0511"; // arka planı boyamak için renk seçimim.
    c.fillRect(0,0,900,600);

    c.drawImage(image_player,pozisyon_x,pozisyon_y); // Oyuncu gemisi çizilecek.
    pozisyon_x += speed*direction; // eger speed değiştiyse eksen yönü değiecek.
    
    if(pozisyon_x <=0){ // eğer gemi başlangıçta veya sondaysa koşulları.
        speed = 0;
        pozisyon_x = 0;
    }
    else if((pozisyon_x + 75) >=900){
        speed = 0;
        pozisyon_x = 825;
    }

    vurus_kontrol(); // dusman vuruldu mu kontrolü. Vurulduysa listeden çıkacak.

    if(dusmanlar.length>0){ // dusmanın asagi dogru ilerlemelesi saglanir. Y ekseni değeri arttırılır.
        c.drawImage(image_uzayli,dusmanlar[0][0],dusmanlar[0][1]);
        dusmanlar[0][1]+= dusman_hizi;   
    }

    if(dusmanlar.length == 0){ // dusman kalmadıysa yeni düşman yaratılır.
        dusman_yarat();
    }

    game_over(); // oyun sonlandı mı kontrolu.

    for(let i = 0; i<mermiler.length; i++){ // mermilerin çizimi.
        c.fillStyle = "yellow";
        c.fillRect(mermiler[i][0],mermiler[i][1],5,5);
    }

    for(let j = 0; j<mermiler.length;j++){ // eğer memi oyun dışına çıktıysa listeden silinmesi sağlanır.
        if(mermiler[j][1]<=0){
            mermiler.pop();
        }
        mermiler[j][1] -= 10;
    }

}

function hareket(e){ // hareket fonksiyonudur.

    if(e.code == "ArrowRight"){ // sağ tuşa basıldığında x ekseninde 5 birim eklenerek sağa gidilir.
        speed = 5;
        direction = 1;
        
    }

    else if(e.code == "ArrowLeft"){   // sol tuşa basıldığında x ekseninde -5 birim eklenerek sağa gidilir.
        speed = -5;
        direction = 1;
       
    }
    else if(e.code =="Space"){ // space ' e basıldığında mermi listesine mermi eklenir.
        fire();
    }
}


function fire(){ // sıkılan mermileri eklemek için kullanacağım.
    let mermi_x = pozisyon_x+20;
    let mermi_y = pozisyon_y;
    mermiler.unshift([mermi_x,mermi_y]);
    gun_audio.play(); // mermi sesi oynatılır. 1 sn olduğundan ötürü her sıkıldığında ses çıkmayabilir.
}

function dusman_yarat(){ // dusman yaratmak için kullandım.

    let dusman_x = Math.random()*800;
    let dusman_y = 0;
    dusmanlar.unshift([dusman_x,dusman_y]); // dusmanlar listeye başa gelecek şekilde eklenir.
}

function vurus_kontrol(){ // dusmanın vurulup vurulmadıgının kontrolunu yaptim.

    for(let i = 0; i<mermiler.length; i++){
        if(dusmanlar.length>0){
            if((mermiler[i][0]>=dusmanlar[0][0] && mermiler[i][0]<=dusmanlar[0][0]+50) && (mermiler[i][1]<=dusmanlar[0][1]+25) && mermiler[i][1]>=dusmanlar[0][1]){
                dusmanlar.pop();
                console.log("dusman vuruldu");
                bomb.play(); // dusman vurulduysa efekt sesi verecek. skor 1 artacak.
                score += 1;
                return true;
            }
        }
    }
}

function game_over(){ // oyunun bitip bitmediğinin kontrolunu yaptım. Oyun biterse her şey sıfırlanacak.

    if(dusmanlar[0][1]>=580){
        alert("Oyun bitti, yeniden başlamak için tamama tıklayın.\nSkor:"+ score + "\nAşama: " + asama);
        dusmanlar.pop();
        pozisyon_x = 435
        pozisyon_y = 555;
        speed = 0;
        mermiler.splice(0,mermiler.length-1);
        asama = 1;
        score = 0;
        dusman_hizi = 3;
        speed = 0;
    }
}








