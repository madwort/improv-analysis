# Improv Analysis 2.0

## Contents

* a Wordpress plugin to store improv analyses in a database
* mostly written in PHP/MySQL, but uses $wpdb object & hides behind the Wordpress login

## How to install

* get plugin files to Wordpress install
  * e.g. `cp -r plugin/ $WORDPRESS_PATH/wp-content/plugins/improv-analysis-2.0`
  * OR `ln -s ~user/improv-analysis-2.0/plugin $WORDPRESS_PATH/wp-content/plugins/improv-analysis-2.0`
* enable plugin
* go to the "install" page of the plugin & create the tables!
* create `plugin/db_config.php` from the template in `plugin/db_config_sample.php`