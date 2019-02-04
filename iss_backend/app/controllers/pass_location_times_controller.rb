class PassLocationTimesController < ApplicationController
    #Post passLocationTimes
    def create
        @passLocationTimes = PassLocationTimes.new(passLocationTimes_params)

        puts @passLocationTimes

        if @passLocationTimes.save
          render json: @passLocationTimes, status: :created, location: @passLocationTimes
        else
          render json: @passLocationTimes.errors, status: :unprocessable_entity
        end
      end
end
