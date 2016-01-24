class AdministratorsController < ApplicationController
  before_action :authenticate_user!
  before_filter :modal_search_exist
  
  layout "administrator"

  def index
    
  end

  def users
    
  end

  def malls
    
  end

  def stores
    
  end

  def products
    
  end

  def brands
    
  end

  def promotions
    
  end

  def setting
    
  end
  
end
