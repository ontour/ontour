<?php

//use Jenssegers\Mongodb\Model as Eloquent;
use Illuminate\Auth\UserInterface;
use Illuminate\Support\Facades\Validator;

class User extends Eloquent implements UserInterface {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

    protected $primaryKey = 'id';

	protected $fillable = array('password', 'email', 'login');

	public $timestamps = false;

    public static $rules = [
        'email'     => 'required | email | unique:users',
        'password'  => 'required | alpha_num | between:6,12 | confirmed',
        'password_confirmation' => 'required | alpha_num | between:6,12'
    ];

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->password;
    }

    /**
     * Get the token value for the "remember me" session.
     *
     * @return string
     */
    public function getRememberToken()
    {
        return $this->remember_token;
    }

    /**
     * Set the token value for the "remember me" session.
     *
     * @param  string $value
     * @return void
     */
    public function setRememberToken($value)
    {
        $this->remember_token = $value;
    }

    /**
     * Get the column name for the "remember me" token.
     *
     * @return string
     */
    public function getRememberTokenName()
    {
        return 'remember_token';
    }

    public function events()
    {
        return $this->hasMany('Event');
    }

}