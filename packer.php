<?php	
	// Url Parameters
	$stringList = '';
	$type = 'js';

	if(isset($_GET['type']) && !empty($_GET['type'])){
		$type = $_GET["type"];
	}
	if(isset($_GET['files']) && !empty($_GET['files'])){
		$stringList = $_GET["files"];		
	}

	// Content type
	$contentType = $type;
	if($type == 'js'){
		$contentType = 'javascript';
	}

	header('Content-Type: text/' . $contentType);

	// Convert $stringList to Array
	$list = explode(",", $stringList);
		
	// Get files content
	$file = '';
	$someFile = false;
	for($i = 0; $i < count($list); ++$i) {	
		$filetemp = @file_get_contents('edit_here/' . $type . '/' . $list[$i] . '.' . $type);
		if($filetemp){
			$file .= $filetemp;
			$someFile = true;
		}		    
	}

	// If there is some file
	if($someFile){
		// echo content
		echo $file;
	}	
?>