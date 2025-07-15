 import { GetGamesDetails } from "./details.js";
 
 export class GamesManager {
  constructor() {
    this.links = document.querySelectorAll(".navbar-nav .nav-link");
    this.gameCardsContainer = document.getElementById("game-cards-container");
     this.lodingSpinner=document.getElementById("loading-spinner");

    this.apiKey = "3832333b16msh62b8f139226dfd8p1f2339jsn7b0aa1cd2b91";
    this.apiHost = "free-to-play-games-database.p.rapidapi.com";
   this.gamesDetailsHandler = new GetGamesDetails(
     this.showLodingSpinner.bind(this),
           this.hideLodingSpinner.bind(this)



   );
          

    this.init();
  }
  init() {
    this.getGames();
    this.addEventListener();
  }
  // دالة لاظهار دائرة التحميل
showLodingSpinner(){
    if(this.lodingSpinner){
        this.lodingSpinner.classList.remove("d-none");
        this.lodingSpinner.classList.add("d-flex");


    }

}
// دالة لاخفاء دائرة التحميل 
hideLodingSpinner(){
    if(this.lodingSpinner){
        this.lodingSpinner.classList.add("d-none");
        this.lodingSpinner.classList.remove("d-flex");

    }
}

  // دالة لجلب الألعاب من الـ API
  async getGames(category = "mmorpg") {
    this.showLodingSpinner();

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": this.apiHost,
      },
    };

    try {
      const apiUrl = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
      const api = await fetch(apiUrl, options);

      if (!api.ok) {
        const errorText = await api.text();
        throw new Error(
          `HTTP error! status: ${api.status}, message: ${errorText}`
        );
      }

      const res = await api.json();
      console.log("API Response for category", category, ":", res); // لعرض الاستجابة في الكونسول

      // تحقق من أن البيانات المستلمة هي مصفوفة قبل محاولة عرضها
      if (Array.isArray(res)) {
      
        this.displayGames(res); // تمرير   // مصفوفة الألعاب مباشرة لدالة العرض
                   
      } else {
        console.error("API response is not an array:", res);
        // عرض رسالة خطأ للمستخدم إذا لم تكن الاستجابة مصفوفة
        if (this.gameCardsContainer) {
          // التأكد من وجود العنصر قبل التعديل
          this.gameCardsContainer.innerHTML = `<div class="col-12 text-center text-white">No games found for this category or an error occurred.</div>`;
        }
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      //عرض رسالة خطأ عامة في حال فشل جلب البيانات
      if (this.gameCardsContainer) {
        // التأكد من وجود العنصر قبل التعديل
        this.gameCardsContainer.innerHTML = `<div class="col-12 text-center text-danger">Failed to load games. Please try again later.</div>`;
      }
    }finally{
      this.hideLodingSpinner();

    }
  }
  // إضافة Event Listeners لروابط التنقل
  addEventListener() {
    this.links.forEach((link) => {
      // حلقة تكرارية على كل رابط في الـ navbar
      link.addEventListener("click", (e) => {
        // إضافة event listener لكل رابط
        e.preventDefault(); //  (عدم إعادة تحميل الصفحة)

        // إزالة الكلاس 'active' من جميع الروابط
        this.links.forEach((navLink) => navLink.classList.remove("active"));

        // إضافة الكلاس 'active' للعنصر الذي تم النقر عليه
        e.currentTarget.classList.add("active");

        // جلب قيمة الـ data-category من الرابط الذي تم النقر عليه
        const category = e.currentTarget.dataset.category;

    
        if (category) {
          this.getGames(category);
        } else {
          console.warn("No data-category found for the clicked link.");
        }
      });
    });
  }
  // method to show games 
  displayGames(games) {
    let gameBox = "";

    for (let i = 0; i < games.length; i++) {
      gameBox += `
 <div class="col-md-3 mb-4">
<div class="card bg-dark text-white h-100 overflow-hidden position-relative game-cards-item" data-id="${games[i].id}">
        <div class="inner position-relative">
            
                <img src="${games[i].thumbnail}" class="card-img-top game-thumbnail" alt="${games[i].title}">
            
        </div>

        <div class="game-card-content"> 
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="card-title text-white flex-grow-1 me-2">${games[i].title}</h5>
                    <button class="btn bg-info btn-sm text-white game-free-btn" type="button">Free</button>
                </div>
                <p class="card-text small text-center opacity-75">${games[i].short_description} </p>
            </div>

            <div class="card-footer bg-dark d-flex justify-content-between align-items-center py-2">
                <span class="btn text-white ms-1">${games[i].genre}</span>
                <span class="btn text-white ms-1">${games[i].platform}</span>
            </div>
        </div>
    </div>
</div>
   

        `;
    }

    this.gameCardsContainer.innerHTML = gameBox;
  }
}
