let mealListEle=document.getElementById('meal-list');
let searchEle=document.getElementById('search-box');
let favouriteMeals=localStorage.getItem('favouriteMeals');
let pageName=window.location.pathname.split('/').pop();

if(searchEle!=null){
    searchEle.addEventListener('input',function(){
        if(searchEle.value.length>0){
            mealListEle.innerHTML='<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
            fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+searchEle.value).then(function(response){
        return response.json();
    }).then(function(data){
        if(data.meals.length>0&&data!=null){
            let meals=data.meals;
            mealListEle.innerHTML='';
            meals.forEach(function(meal){
                let alreadyAdded=false;
                let mealEle=document.createElement('a');
                mealEle.setAttribute("class","list-group-item list-group-item-action");
                mealEle.setAttribute("href","javascript:void(0)");
                mealEle.setAttribute("mealId",meal.idMeal);
                mealEle.setAttribute("mealName",meal.strMeal);
                mealEle.addEventListener('click',function(e){
                    console.log("clicked");
                    let mealId=e.target.getAttribute('mealId');
                    let mealName=e.target.getAttribute('mealName');
                    fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+mealId).then(function(response){
                        return response.json();
                    }).then(function(data){
                        let meal=data.meals[0];
                        // let mealDetailsEle=document.getElementById('meal-details');
                        mealListEle.innerHTML='';
                        let mealTitleEle=document.createElement('h3');
                        mealTitleEle.innerHTML=meal.strMeal;
                        mealListEle.appendChild(mealTitleEle);
                        let mealImageEle=document.createElement('img');
                        mealImageEle.setAttribute("src",meal.strMealThumb);
                        mealImageEle.setAttribute("class","img-fluid");
                        mealListEle.appendChild(mealImageEle);
                        let mealCategoryEle=document.createElement('p');
                        mealCategoryEle.innerHTML="Category: "+meal.strCategory;
                        mealListEle.appendChild(mealCategoryEle);
                        let mealAreaEle=document.createElement('p');
                        mealAreaEle.innerHTML="Area: "+meal.strArea;
                        mealListEle.appendChild(mealAreaEle);
                        let mealInstructionsEle=document.createElement('p');
                        mealInstructionsEle.innerHTML="Instructions: "+meal.strInstructions;
                        mealListEle.appendChild(mealInstructionsEle);
                        let mealIngredientsEle=document.createElement('ul');
                        mealIngredientsEle.innerHTML="<b>Ingredients</b>";
                        mealListEle.appendChild(mealIngredientsEle);
                        for(let i=1;i<=20;i++){
                            if(meal['strIngredient'+i]!=null&&meal['strIngredient'+i]!=''){
                                let ingredientEle=document.createElement('li');
                                ingredientEle.innerHTML=meal['strIngredient'+i]+" - "+meal['strMeasure'+i];
                                mealIngredientsEle.appendChild(ingredientEle);
                            }
                        }
                    }).catch(error => {
                        // Step 5: Handle errors (network issues, HTTP errors, etc.)
                        // console.error('Fetch error:', error);
                        mealListEle.innerHTML='<div class="alert alert-danger" role="alert">No Meal Found</div>';
                        setTimeout(function(){
                            mealListEle.innerHTML='';
                        },2000);
                    }).finally(() => {
                        // Step 6: Perform cleanup in the finally block
                        // console.log('Cleaning up...');
                    });
                });
                let favouriteEle=document.createElement('button');
                    favouriteEle.setAttribute("class","btn btn-danger float-end");
                    favouriteEle.innerHTML="Add to Favourites";
                favouriteEle.setAttribute("id","btn-favourite-"+meal.idMeal);
                favouriteEle.addEventListener('click',function(e){
                    if(favouriteMeals==null){
                        favouriteMeals=[];
                    }
                    else{
                        favouriteMeals=JSON.parse(favouriteMeals);
                        }
                        favouriteMeals.forEach(function(ml){
                    if(ml.idMeal==meal.idMeal){
                        alert('Meal Already Added to Favourites');
                        alreadyAdded=true;
                        return;
                    }
                });
                    if(!alreadyAdded){

                        favouriteMeals.push(meal);
                        localStorage.setItem('favouriteMeals',JSON.stringify(favouriteMeals));
                        alert('Meal Added to Favourites');
                        favouriteEle.removeAttribute('class');
                        favouriteEle.setAttribute('class','btn btn-success float-end');
                        favouriteEle.innerHTML='Added to Favourites';
                    }
                });
                mealEle.innerHTML=meal.strMeal;
                mealEle.appendChild(favouriteEle);
                mealListEle.appendChild(mealEle);
            // });
            });
        }else{
            mealListEle.innerHTML='<div class="alert alert-danger" role="alert">No Meal Found</div>';
            setTimeout(function(){
                mealListEle.innerHTML='';
            },2000);
        }
    })  .catch(error => {
        // Step 5: Handle errors (network issues, HTTP errors, etc.)
        // console.error('Fetch error:', error);
            mealListEle.innerHTML='<div class="alert alert-danger" role="alert">No Meal Found</div>';
            setTimeout(function(){
                mealListEle.innerHTML='';
            },2000);
        }).finally(() => {
        // Step 6: Perform cleanup in the finally block
        // console.log('Cleaning up...');
        
    });
}else{
    mealListEle.innerHTML='';
}
});
}else if(pageName=="favourites.html"){
if(favouriteMeals!=null){
    let mealTitleEle=document.createElement('h3');
    mealTitleEle.innerHTML="Favourite Meals";
    mealListEle.appendChild(mealTitleEle);
    favouriteMeals=JSON.parse(favouriteMeals);
    favouriteMeals.forEach(function(meal){
        let mealEle=document.createElement('a');
        mealEle.setAttribute("class","list-group-item list-group-item-action");
        mealEle.setAttribute("href","javascript:void(0)");
        mealEle.setAttribute("mealId",meal.idMeal);
        mealEle.setAttribute("mealName",meal.strMeal);
        let favouriteEle=document.createElement('button');
        favouriteEle.setAttribute("class","btn btn-success float-end");
        favouriteEle.innerHTML="Added to Favourites";
        favouriteEle.setAttribute("id","btn-favourite-"+meal.idMeal);
        mealEle.innerHTML=meal.strMeal;
        mealEle.appendChild(favouriteEle);
        mealListEle.appendChild(mealEle);
    });
}else{
    mealListEle.innerHTML='<div class="alert alert-danger" role="alert">No Favourites Added</div>';
    setTimeout(function(){
        mealListEle.innerHTML='';
    },2000);
}

}