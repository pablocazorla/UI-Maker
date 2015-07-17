<?php

	$file = $_POST['file'];
	$content = $_POST['content'];

	file_put_contents('edit_here/less/' . $file . '.less', $content);
?>