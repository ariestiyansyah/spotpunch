class Store < ActiveRecord::Base
  belongs_to :brand
  belongs_to :mall
  has_many   :reviews

  extend FriendlyId
  friendly_id :slug_candidates, use: :slugged, slug_column: :permalink

  def slug_candidates
    [
      :name,
      [:name, self.create_slug]
    ]
  end
  
  def create_slug uid=nil
    counter     = uid || 0
    candidates  = FriendlyId::Candidates.new(self,self.name)
    stores      = Store.where(permalink:candidates.first)
    unless stores.blank?
      temp_slug   = stores.first.permalink  
    end
    unique_id   = counter + 1
    if Store.exists?(permalink:"#{temp_slug}-#{unique_id}")
      self.create_slug unique_id
    else
      return unique_id
    end
  end
  
  # def to_slug
  #   self.permalink = self.permalink.strip
  #   self.permalink.gsub! /\s*@\s*/, " at "
  #   self.permalink.gsub! /\s*&\s*/, " dan "
  #   self.permalink = self.permalink.parameterize
  #   self.permalink.gsub! /[-_]{2,}/, "-"
  #   self.permalink.gsub! /-+/, "-"
  #   self.permalink.gsub! /\A[-\.]+|[-\.]+\z/, ""
  # end

end
