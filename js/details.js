// file to display details of games

export class GetGamesDetails {

    constructor(showSpinnerCallback,hideSpinnerCallback) {
        this.gamesDetailsContainer = document.getElementById("gamesDetailsContainer");
        this.gameCardsContainer = document.getElementById("game-cards-container"); 
        this.navbarsection = document.getElementById("navbar-section");
         this.showLoadingSpinner = showSpinnerCallback;
        this.hideLoadingSpinner = hideSpinnerCallback;


    this.addClickListenerToGameCards(); 
        this.apiKey = '3832333b16msh62b8f139226dfd8p1f2339jsn7b0aa1cd2b91';
        this.apiHost = 'free-to-play-games-database.p.rapidapi.com';

       
    }

    // method to get api
    async getGamesById(gameId) {
        // إذا لم يتم العثور على أي من الحاويتين، لا يمكن متابعة العملية
        if (!this.gameCardsContainer || !this.gamesDetailsContainer) {
            console.error("Required DOM elements not found. Cannot fetch game details.");
            return;
        }
        
        this.showLoadingSpinner();
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': this.apiHost,
            }
        };

        try {
            const apiUrl = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`;
            const api = await fetch(apiUrl, options);

            if (!api.ok) {
                const errorText = await api.text();
                throw new Error(
                    `HTTP error! status: ${api.status}, message: ${errorText}`
                );
            }

            const res = await api.json();
            console.log("API Response for Game Id", gameId, ":", res);

            if (res && typeof res === 'object' && !Array.isArray(res)) {
                this.displayGameDetails(res); // تمرير الكائن المفرد لدالة العرض
                this.navbarsection.classList.add("d-none");//اخفاء navbar 
                this.gameCardsContainer.classList.add("d-none"); // إخفاء قسم الألعاب
                this.gamesDetailsContainer.classList.remove("d-none"); // إظهار تفاصيل اللعبة
            } else {
                console.error("API response is not a single game object:", res);
                if (this.gamesDetailsContainer) {
                    this.gamesDetailsContainer.innerHTML = `<div class="col-12 text-center text-white">No game details found or an unexpected response format.</div>`;
                 this.navbarsection.classList.add("d-none");//اخفاء navbar 
                    this.gamesDetailsContainer.classList.remove('d-none');
                    this.gameCardsContainer.classList.add('d-none');
                }
            }
        } catch (error) {
            console.error("Error fetching game details:", error);
            if (this.gamesDetailsContainer) {
                this.gamesDetailsContainer.innerHTML = `<div class="col-12 text-center text-danger">Failed to load game details. Please try again later.</div>`;
               this.navbarsection.classList.add("d-none");//اخفاء navbar 
                this.gamesDetailsContainer.classList.remove('d-none');
                this.gameCardsContainer.classList.add('d-none');
            }
        } finally{
            this.hideLoadingSpinner();
        }
    }
 

    displayGameDetails(game) {
        if (!this.gamesDetailsContainer) {
            console.error("gamesDetailsContainer element not found. Cannot display details.");
            return;
        }

        let gameDetails = `
            <div class="game-detail-card bg-dark text-white p-4">
                <button class="btn btn-outline-light position-absolute top-0 end-0 m-3" id="closeDetailsBtn">
                    <i class="fas fa-times"></i>
                </button>
                <div class="row">
                    <div class="col-md-4">
                        <img src="${game.thumbnail}" alt="${game.title}" class="img-fluid rounded mb-3">
                    </div>
                    <div class="col-md-8">
                        <h2>${game.title}</h2>
                        <p class="text-muted">${game.developer} - ${game.release_date}</p>
                        <p>${game.description}</p>
                        <p></span>Categroy:</span> <span class="badge ">${game.genre}</span></p>
                        <p><span>Platform:</span> <span class="badge">${game.platform}</span></p>
                        <p><span>Status:</span> <span class="badge">${game.status}</span></p>

                        <a href="${game.game_url}" target="_blank" class="btn btn-outline-warning text-white mt-3">Show Game</a>
                    </div>
                </div>
            </div>
        `;

        this.gamesDetailsContainer.innerHTML = gameDetails;

        // عند الضغط على الإغلاق، يخفي محتوى التفاصيل
        document.getElementById("closeDetailsBtn").addEventListener('click', () => {
            this.hideGameDetails();
        });
    }

    addClickListenerToGameCards() {
        if (!this.gameCardsContainer) {
            console.error("gameCardsContainer element not found when trying to get game by ID.");
            return;
        }
        this.gameCardsContainer.addEventListener("click", (e) => {
            const cardElement = e.target.closest(".game-cards-item");

            if (cardElement) {
                e.preventDefault();
                const gameId = cardElement.dataset.id;
                if (gameId) {
                    this.getGamesById(gameId);
                } else {
                    console.warn("No data-id found on the clicked game card.");
                }
            }
        });
    }

    // دالة لإخفاء تفاصيل اللعبة والعودة لقائمة الألعاب
    hideGameDetails() {
        if (this.gamesDetailsContainer && this.gameCardsContainer) { // الآن يمكننا الاعتماد على أن هذه المتغيرات مهيأة
            this.gamesDetailsContainer.classList.add('d-none'); // إخفاء قسم التفاصيل
              this.navbarsection.classList.remove("d-none");//اخفاء navbar 

            this.gameCardsContainer.classList.remove('d-none'); // إظهار قسم البطاقات
        } else {
            console.error("Cannot hide game details: containers not found.");
        }
    }
}