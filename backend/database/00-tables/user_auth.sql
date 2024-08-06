CREATE TABLE IF NOT EXISTS public.hashing_algorithm (
    id serial PRIMARY KEY,
    algorithm_name varchar(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_validation_status (
    id serial PRIMARY KEY,
    status_description varchar(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_login_data (
    user_id integer PRIMARY KEY,
    username varchar(32) NOT NULL,
    email varchar(255) NOT NULL,
    
    password_hash varchar(250) NOT NULL,
    password_salt varchar(100) NOT NULL,
    password_hashing_algorithm_id integer NOT NULL,

    confirmation_token varchar(100) NOT NULL,
    token_genration_time timestamp NOT NULL,

    email_validation_status_id integer NOT NULL,

    password_recovery_token varchar(100) NOT NULL,
    password_recovery_token_genration_time timestamp NOT NULL,

    registration_time timestamp NOT NULL
);

ALTER TABLE public.user_login_data ADD CONSTRAINT fk_user_login_data_hashing_algorithm_id FOREIGN KEY (password_hashing_algorithm_id) REFERENCES public.hashing_algorithm(id);
ALTER TABLE public.user_login_data ADD CONSTRAINT fk_user_login_data_email_validation_status_id FOREIGN KEY (email_validation_status_id) REFERENCES public.email_validation_status(id);

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id serial PRIMARY KEY,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    gender char(1) NOT NULL,
    date_of_birth date NOT NULL,
    accept_terms_of_service boolean NOT NULL,
    time_zone varchar(100) NOT NULL
);

ALTER TABLE public.user_profiles ADD CONSTRAINT fk_user_profiles_user_id FOREIGN KEY (id) REFERENCES public.user_login_data(user_id);

CREATE TABLE IF NOT EXISTS public.login_attempts (
    id serial PRIMARY KEY,
    user_id integer NOT NULL,
    login_time timestamp NOT NULL,
    login_status boolean NOT NULL,
    ip_address varchar(15) NOT NULL,
    browser_type varchar(100) NOT NULL
);

ALTER TABLE public.login_attempts ADD CONSTRAINT fk_login_attempts_user_id FOREIGN KEY (user_id) REFERENCES public.user_login_data(user_id);