Rails.application.routes.draw do
  
  devise_for :users, controllers: {registrations: 'registrations'}
  root 'home#index'

  resources :administrators, only: [:index]  do
    get 'users'                       => 'administrators#users',                on: :collection
    get 'malls'                       => 'administrators#malls',                on: :collection
    get 'stores'                      => 'administrators#stores',               on: :collection
    get 'products'                    => 'administrators#products',             on: :collection
    get 'promotions'                  => 'administrators#promotions',           on: :collection
    get 'setting'                     => 'administrators#setting',              on: :collection
    get 'import'                      => 'administrators#import',               on: :collection
    collection { post :import }
  end
  
  resources :malls, only:[:show] do
    get   ':name/:permalink'                      => 'stores#show',       on: :collection, as: :show
    get   ':name/:permalink/:product_id'          => 'products#show',     on: :collection, as: :products_show
    post  ':name/:permalink/:product_id/reviews'  => 'reviews#create',    on: :collection, as: :reviews_create
    post  ':mall_id/follow'                       => 'malls#follow',      on: :collection, as: :follow
    post  ':mall_id/unfollow'                     => 'malls#unfollow',    on: :collection, as: :unfollow
  end

  resources :brands, only:[] do
    post  ':brand_id/follow'      => 'brands#follow',    on: :collection, as: :follow
    post  ':brand_id/unfollow'    => 'brands#unfollow',  on: :collection, as: :unfollow
  end

  resources :stores, only:[] do
    post  ':store_id/follow'      => 'stores#follow',    on: :collection, as: :follow
    post  ':store_id/unfollow'    => 'stores#unfollow',  on: :collection, as: :unfollow
  end

  resources :users, only:[] do
    post  ':user_id/follow'       => 'users#follow',    on: :collection, as: :follow
    post  ':user_id/unfollow'     => 'users#unfollow',  on: :collection, as: :unfollow
  end

  resources :products, only:[] do
    post  ':product_id/like'      => 'products#like',     on: :collection, as: :like
    post  ':product_id/dislike'   => 'products#dislike',  on: :collection, as: :dislike
  end

  resources :reviews, only:[] do
    post  ':review_id/like'      => 'reviews#like',     on: :collection, as: :like
    post  ':review_id/dislike'   => 'reviews#dislike',  on: :collection, as: :dislike
  end

  # resources :brands, only:[] do
  #   resources :products, only:[:show] do
  #     resources :reviews
  #   end
  # end

  get   '/:permalink'                 => 'home#profile',                        as: "profile",              :constraints => { :name => /[^\/]+/ }
end
