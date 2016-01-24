class Mall < ActiveRecord::Base
  acts_as_followable
  
  has_many :stores
  
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
    malls    = Mall.where(permalink:candidates.first)
    unless malls.blank?
      temp_slug   = malls.first.permalink  
    end
    unique_id   = counter + 1
    if Mall.exists?(permalink:"#{temp_slug}-#{unique_id}")
      self.create_slug unique_id
    else
      return unique_id
    end
  end

  def self.import(file, is_update)
    if is_update
      
    else
      log ||= Logger.new("#{Rails.root}/log/mall_import.log")
      spreadsheet = open_spreadsheet(file)
      log.info(" Start importing for #{file.original_filename} ")
      log.info(" ----- ")
      header = spreadsheet.row(1)
      (2..spreadsheet.last_row).each do |i|
        mall                = self.find_by_name(spreadsheet.row(i)[1]) || self.new
        mall.name           = spreadsheet.row(i)[1]  
        mall.address        = spreadsheet.row(i)[2]
        mall.city           = spreadsheet.row(i)[3]
        mall.phone          = spreadsheet.row(i)[4]
        mall.standing_floor = spreadsheet.row(i)[5]
        mall.description    = spreadsheet.row(i)[6]
        if mall.save
          log.info("#{i-1} - Restaurant successfully saved: #{mall.name}, #{mall.permalink}")
        end
      end
      log.info(" ----- ----- ----- ----- ")
    end
  end

  def self.open_spreadsheet(file)
    case File.extname(file.original_filename)
    when ".csv" then Roo::Csv.new(file.path)
    when ".xls" then Roo::Excel.new(file.path)
    when ".xlsx" then Roo::Excelx.new(file.path)
    else raise "Unknown file type: #{file.original_filename}" 
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
