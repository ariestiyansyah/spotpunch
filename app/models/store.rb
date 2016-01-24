class Store < ActiveRecord::Base
  belongs_to  :brand
  belongs_to  :mall
  has_many    :reviews
  has_many    :store_product
  has_many    :products, through: :store_product

  def self.import(file, is_update)
    if is_update
      
    else
      log ||= Logger.new("#{Rails.root}/log/store_import.log")
      spreadsheet = open_spreadsheet(file)
      log.info(" Start importing for #{file.original_filename} ")
      log.info(" ----- ")
      header = spreadsheet.row(1)
      (2..spreadsheet.last_row).each do |i|
        mall                      = Mall.find_by_name(spreadsheet.row(i)[3])
        unless mall.blank?
          store                     = self.new
          store.name                = spreadsheet.row(i)[1]                
          store.kind                = spreadsheet.row(i)[2]                
          store.mall                = mall             
          store.desc                = spreadsheet.row(i)[4]                
          store.area                = spreadsheet.row(i)[5]                
          store.city                = spreadsheet.row(i)[6]                
          store.standing_floor_name = spreadsheet.row(i)[8] 
          store.address             = mall.address             
          store.phone               = spreadsheet.row(i)[9]
          unless spreadsheet.row(i)[7].blank?
            brand       = Brand.find_by_name spreadsheet.row(i)[7]
            store.brand = brand
          end
          store.permalink           = spreadsheet.row(i)[1]
          store.to_slug
          if store.save
            log.info("#{i-1} - Store successfully saved: #{store.name}, #{store.permalink}")
          end
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
