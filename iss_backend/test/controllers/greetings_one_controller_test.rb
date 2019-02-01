require 'test_helper'

class GreetingsOneControllerTest < ActionDispatch::IntegrationTest
  test "should get hello" do
    get greetings_one_hello_url
    assert_response :success
  end

end
