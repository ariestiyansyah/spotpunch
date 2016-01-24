class Brand < ActiveRecord::Base
  acts_as_followable
  has_many  :stores
  has_many  :products
  has_one   :permalink, as: :linkable

  def self.import(file, is_update)
    if is_update
      
    else
      log ||= Logger.new("#{Rails.root}/log/brand_import.log")
      spreadsheet = open_spreadsheet(file)
      log.info(" Start importing for #{file.original_filename} ")
      log.info(" ----- ")
      header = spreadsheet.row(1)
      (2..spreadsheet.last_row).each do |i|
        brand       = self.find_by_name(spreadsheet.row(i)[1]) || self.new
        brand.name  = spreadsheet.row(i)[1]                
        brand.kind  = spreadsheet.row(i)[2]                
        if brand.save
          log.info("#{i-1} - Brand successfully saved: #{brand.name}")
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
end
