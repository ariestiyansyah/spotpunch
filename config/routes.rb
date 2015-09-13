Rails.application.routes.draw do
  
  devise_for :users
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
  end

  # resources :brands, only:[] do
  #   resources :products, only:[:show] do
  #     resources :reviews
  #   end
  # end

  get   '/:permalink'                 => 'home#profile',                        as: "profile",              :constraints => { :name => /[^\/]+/ }
end
