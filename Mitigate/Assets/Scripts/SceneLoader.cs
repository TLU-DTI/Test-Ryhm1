using System;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class SceneLoader : MonoBehaviour
{
    public string SceneName;
    
    public void LoadScene(string sceneName)
    {
        SceneName = sceneName;
        SceneManager.sceneLoaded += OnSceneLoaded;
        SceneManager.LoadScene(sceneName);
    }

    public void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
        GameObject mainMenu;
        Debug.Log(SceneName);
        if (SceneName == "GameScene")
        {
            mainMenu = GameObject.Find("GameUI");
        }
        else
        {
            mainMenu = GameObject.Find("MainMenu");
        }
        
        GameObject settingsMenu = GameObject.Find("Settings");
        Button generalButton = GameObject.Find("GeneralButton").GetComponent<Button>();
        Button audioButton = GameObject.Find("AudioButton").GetComponent<Button>();
        GameObject generalSettings = GameObject.Find("GeneralSettings");
        GameObject audioSettings = GameObject.Find("AudioSettings");
        Button optionsButton = GameObject.Find("OptionsButton").GetComponent<Button>();
        Button backButton = GameObject.Find("BackButton").GetComponent<Button>();

        //Debug.Log(mainMenu.name + ", " + settingsMenu.name + ", " + generalButton.name + ", " + audioButton.name + ", " + generalSettings.name + ", " + audioSettings.name + ", " + optionsButton.name + ", " + backButton.name);

        // Assign the UI elements to the OptionsManager
        OptionsManager.Instance.AssignUIElements(mainMenu, settingsMenu, generalButton, audioButton, generalSettings, audioSettings, optionsButton, backButton);
        GameObject.Find("Audio").SetActive(false);
        GameObject.Find("Settings").SetActive(false);
    }
}
