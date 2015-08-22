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
  
  resources :malls, only:[] do
    get   ':name/:permalink'          => 'stores#show',                         on: :collection, as: :show
  end
  
  get   '/:permalink'                 => 'home#profile',                        as: "profile",              :constraints => { :name => /[^\/]+/ }
end
