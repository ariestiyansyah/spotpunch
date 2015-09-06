class Store < ActiveRecord::Base
  belongs_to :brand
  belongs_to :mall
  has_many   :reviews

  def to_slug counter=0
    self.permalink = self.permalink.strip
    self.permalink.gsub! /\s*@\s*/, " at "
    self.permalink.gsub! /\s*&\s*/, " dan "
    self.permalink = self.permalink.parameterize
    self.permalink.gsub! /[-_]{2,}/, "-"
    self.permalink.gsub! /-+/, "-"
    self.permalink.gsub! /\A[-\.]+|[-\.]+\z/, ""
    if self.mall.stores.exists?(:permalink => self.permalink)
      self.permalink = "#{self.permalink}-#{counter+1}"
      self.to_slug counter + 1
    end
  end

end
